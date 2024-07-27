import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSecretCookies = (userId, res) => {

    const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });

    res.cookie("jwt-netflix", token, {
        httpOnly: true, // prevent XSS attack cross-site scripting attacks, make it not be accessible by javascript 
        maxAge: 15 * 24 * 60 * 60 * 1000,// 15 days in MS
        sameSite: "strict", // CSRF attack cross-site request forgery attacks
        secure: ENV_VARS.NODE_ENV !== "development",
    });

    return token;
}


