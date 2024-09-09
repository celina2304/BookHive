import jwt from "jsonwebtoken";
import config from "../config/config.js";

const JWT_AUTH_KEY = config.jwtAuthKey;

export const checkAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            // console.log("Token: ", authHeader)
            return res.status(401).json({
                message: "Authorization token missing or malformed",
            });
        }
        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_AUTH_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        error: "Token expired",
                    });
                } else {
                    return res.status(403).json({
                        error: "Invalid token",
                    });
                }
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};