import dotenv from "dotenv";

// configuring paths of env as per production or development

// to set path use command #env
dotenv.config({
    path: process.env.NODE_ENV === "production" ? "../.env.production" : "../.env.development",
})

const config = {
    db: {
        dbURI: process.env.MONGODB_URL
    },
    port: process.env.PORT,
    jwtAuthKey: process.env.JWT_AUTH_KEY,
}

export default config;