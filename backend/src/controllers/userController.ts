import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// config
import config from "../config/config.js";

// models
import User from "../models/userModel";
import RefreshTokenModel from "../models/refreshTokenModel.js";
import { generateTokens } from "../utils/jwt.js";

if (!config.NODE_ENV) {
    throw new Error("NODE_ENV not present in config")
}
const NODE_ENV = config.NODE_ENV;

// GET requests
/*
Route           /users/
Description     get all users
Access          admin
Parameters            
Method          GET
*/
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await User.find();
        res.status(200).json({
            allUsers: allUsers
        });
    } catch (error) {
        console.error("Error retrieving all users:", error);
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

/*
Route           /users/:id
Description     get user using id
Access          admin, user
Parameters      id
Method          GET
*/
export const getUserById = async (req: Request, res: Response) => {
    try {
        const _id = req.user?._id;

        if (!_id) res.status(400).json({
            message: "Please provide user ID"
        })
        const user = await User.findById(_id);

        if (!user) res.status(400).json({
            message: "User not found"
        })

        res.status(200).json(user);

    } catch (error) {
        console.error("Error retrieving all users:", error);
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

/*
Route           /users/register
Description     create new user
Access          public
Parameters      ""      
Method          POST
*/
export const register = async (req: Request, res: Response) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        if (!firstName || !lastName || !email || !password) return res.status(400).json({
            message: "Please provide User Details!"
        })
        // if user exists return 
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "This email is already registered" })

        // create hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone: "",
            address: "",
            role: "user",
            fines: 0,
            avatar: ""
        })
        await user.save();

        return res.status(201).json({
            message: "User registered Successfully",
            user: {
                _id: user?._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

/*
Route           /users/login
Description     login existing user
Access          public
Parameters      ""      
Method          POST
*/
export const login = async (req: Request, res: Response) => {
    try {

        // retrieve email and password from request body
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide both email and password."
            });
        }

        // Find the user by email
        const user = await User.findOne({
            email
        });

        // If user not found, return an error
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match, return an error
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }
        const userId = user._id.toString();

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await generateTokens(userId)

        // revoke all the old tokens
        await RefreshTokenModel.updateMany({ userId, revoked: false }, { revoked: true });

        // Save new refresh token
        const newRefreshToken = new RefreshTokenModel({
            userId,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
        await newRefreshToken.save();

        // save refresh token as cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return the user data along with tokens
        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user?._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar
            },
            token: accessToken
        });

    } catch (error) {
        // Handle any unexpected errors
        console.error("Login error:", error);
        return res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

/*
Route           /users/refresh
Description     When access token expires, the client sends refreshToken to /auth/refresh
Access          public
Parameters      ""
Method          POST
*/
export const refresh = async (req: Request, res: Response) => {

    // extract old refresh token from cookies
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) return res.status(401).json({ error: "No refresh token" });

    try {
        // verify jwt signature
        const payload = jwt.verify(oldRefreshToken, config.JWT_REFRESH_SECRET!) as { userId: string };

        // Lookup for token in DB (check revoked == false and no expired)
        const storedToken = await RefreshTokenModel.findOne({ token: oldRefreshToken, revoked: false });
        if (!storedToken) return res.status(403).json({ error: "Invalid refresh token" });

        // check validity of provided token and stored refresh token
        const isMatch = await bcrypt.compare(oldRefreshToken, storedToken.token);
        if (!isMatch) return res.status(403).json({ error: "Invalid refresh token" });

        // rotate refresh token (invalidate old, create new one)
        storedToken.revoked = true;
        await storedToken.save();

        // generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(payload.userId);

        // save refresh token as HttpOnly cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // return accessToken as JSON
        return res.json({ accessToken });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(403).json({ message: "Expired or invalid refresh token." });
    }
};

/*
Route           /users/logout
Description     User logs out → just revoke their refresh token in DB.
Access          public
Parameters      ""
Method          POST
*/
export const logout = async (req: Request, res: Response) => {
    try {
        // retrieve refresh token from cookies
        const refreshToken = req.cookies?.refreshToken;
        // update the token in DB as revoked = true
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required for logout" })
        }
        await RefreshTokenModel.updateOne({ token: refreshToken }, { revoked: true });

        // clear cookie 
        res.clearCookie("refreshToken");
        return res.json({ message: "Logged out" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};


// PUT requests 

/*
Route           /users/change-password/:id
Description     update user password
Access          admin, user
Parameters      "id"
Body            old password, new password
Method          PUT
*/

export const updateUserPassword = async (req: Request, res: Response) => {
    try {
        // extract user id from auth middleware and params
        const _id = req.user?._id;

        // check if both are present
        if (!_id ) return res.status(400).json({ message: "Please provide user id" })
        
        // extract passwords from request body
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide both old and new password" });
        }

        // find user by id
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // check if old passwords match
        const isMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isMatched) return res.status(400).json({ message: "Old passwords don't match" });

        // create hashed password from new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // save changes
        await user.save();

        return res.status(200).json({ message: "Updated password successfully" });
    } catch (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ message: "Something went wrong." });
    }
}

/*
Route           /users/update-user/:id
Description     update user by id
Access          admin, user
Parameters      ""      
Method          PUT
*/

export const updateUserById = async (req: Request, res: Response) => {
    try {
        const _id = req.user?._id;
        const updatedDetails = req.body;

        // retrieve user id from params
        if (!_id || !updatedDetails) return res.status(400).json({
            message: "Please provide both id and details"
        })

        // find user by id
        const requester = await User.findById(_id).select("role");
        if (!requester) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const requesterRole = requester.role;

        // whitelist fields
        let allowedFields = ["firstName", "lastName", "email", "phone", "address", "avatar"];

        if (requesterRole === "admin") {
            allowedFields.push("role");
            allowedFields.push("fines");
            allowedFields.push("borrowedBooks");
        }

        // updates
        const updates: Record<string, any> = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        // check if fields provided are valid or not
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        // update userDetails
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            updates, {
            new: true
        })
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: updatedUser
        });
    } catch (error: any) {
        console.error("Update user error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
// DELETE requests 
/*
Route           /users/delete-user/:id
Description     delete user by id
Access          admin
Parameters      ""      
Method          DELETE
*/
export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const _id = req.user?._id;
        if (!_id) res.status(400).json({
            message: "Please provide ID"
        });

        const deletedUser = await User.findByIdAndDelete(_id);
        if (!deletedUser) return res.status(400).json({ message: "Couldn't delete user" })
        res.status(200).json({
            message: "User Deleted Successfully!"
        })
    } catch (error) {
        res.status(400).json({
            error: error
        });
    }
}