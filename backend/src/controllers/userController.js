import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt, {
    genSaltSync
} from "bcrypt";

import config from "../config/config.js";
import userModel from "../models/userModel.js";

const JWT_AUTH_KEY = config.jwtAuthKey;

// GET requests
/*
Route           /user/
Description     get all users
Access          public //private (admin-only)
Parameters      ""      
Method          GET
*/
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).json({
            allUsers: allUsers
        });
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
};
/*
Route           /user/:id
Description     get user using id
Access          public //protected (user-only)
Parameters      id
Method          GET
*/
export const getUserById = async (req, res) => {
    try {
        const {
            _id
        } = req.params;

        if (!_id) res.status(400).json({
            message: "Please provide ID"
        })
        const user = await User.findById(
            _id
        );

        if (!user) res.status(400).json({
            message: "User not found"
        })
        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
};
// POST requests 
/*
Route           /user/signup
Description     create new user
Access          public
Parameters      ""      
Method          POST
*/
export const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;
        if (!name || !email || !password) res.status(400).json({
            message: "Please provide User Details!"
        })
        const salt = genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const accessToken = jwt.sign({
            result: email
        }, JWT_AUTH_KEY, {
            expiresIn: "1d"
        })
        const refreshToken = jwt.sign({
            result: email
        }, JWT_AUTH_KEY, {
            expiresIn: "7d"
        })
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: "user",
            accessToken,
            refreshToken
        })
        await user.save();
        res.status(200).json({
            user: user
        });
    } catch (error) {
        res.status(400).json({
            error: error
        })

    }
};

/*
Route           /user/login
Description     login existing user
Access          public
Parameters      ""      
Method          POST
*/
export const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

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
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match, return an error
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        // Generate access and refresh tokens
        const accessToken = jwt.sign({
            email
        }, JWT_AUTH_KEY, {
            expiresIn: "1d"
        });
        const refreshToken = jwt.sign({
            email
        }, JWT_AUTH_KEY, {
            expiresIn: "7d"
        });

        const updatedUser = await userModel.findOneAndUpdate({
            email
        }, {
            accessToken,
            refreshToken
        }, {
            new: true
        })

        // Return the user data along with tokens
        return res.status(200).json({
            message: "Login successful",
            user: updatedUser
        });

    } catch (error) {
        // Handle any unexpected errors
        return res.status(500).json({
            message: "An error occurred during login.",
            error
        });
    }
};

// PUT requests 
/*
Route           /user/update-user/:id
Description     update user by id
Access          private (user)
Parameters      ""      
Method          PUT
*/
export const updateUserById = async (req, res) => {
    try {
        const {
            _id
        } = req.params;
        const updatedDetails = req.body;
        if (!_id || !updatedDetails) res.status(400).json({
            message: "Please provide both id and details"
        })
        const user = await User.findByIdAndUpdate(
            _id,
            updatedDetails, {
                new: true
            })
        res.status(200).json({
            user: user
        });
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
};
// DELETE requests 
/*
Route           /user/delete-user/:id
Description     delete user by id
Access          private (user)
Parameters      ""      
Method          DELETE
*/
export const deleteUserById = async (req, res) => {
    try {
        const {
            _id
        } = req.params;
        if (!_id) res.status(400).json({
            message: "Please provide ID"
        });
        await User.findByIdAndDelete(_id);
        res.status(200).json({
            message: "User Deleted Successfully!"
        })
    } catch (error) {
        res.status(400).json({
            error: error
        });
    }
}