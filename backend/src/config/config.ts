import dotenv from "dotenv";

// configuring paths of env as per production or development

// to set path use command #env
dotenv.config({
    path: process.env.NODE_ENV === "production" ? "../.env.production" : "../.env.development",
})

const config = {
    NODE_ENV: process.env.NODE_ENV,
    DB: {
        DATABASE_URL: process.env.DATABASE_URL
    },
    PORT: process.env.PORT,
    JWT_AUTH_KEY: process.env.JWT_AUTH_KEY,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
}

export default config;