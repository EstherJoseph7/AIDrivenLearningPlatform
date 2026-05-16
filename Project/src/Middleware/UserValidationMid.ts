import { Request, Response, NextFunction } from "express";
import { User } from "../Models/UserModel";

/**
 * Validates password strength: must be at least 8 characters and contain
 * both letters and digits. Runs before the registration handler.
 */
export function validatePassword(req: Request, res: Response, next: NextFunction) {
    const password: string = req.body.password;
    if (password == null) {
        return res.status(400).json({ error: "Must enter a password" });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: "Invalid password. Must enter at least 8 characters" });
    }
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    if (!hasLetters || !hasNumbers) {
        return res.status(400).json({ error: "Invalid password. password must contain letters and digits." });
    }
    next();
}

/**
 * Checks that the provided user ID is exactly 9 digits and does not already exist in the database.
 * Accepts the ID from either req.body.id or req.body.userId to support different request shapes.
 */
export async function checkUser(req: Request, res: Response, next: NextFunction) {
    const id = req.body.id || req.body.userId;
    if (id != undefined) {
        if (id.length !== 9)
            return res.status(400).json({ error: "ID must be exactly 9 digits" });
        const isUser = await User.findById(id);
        if (isUser != null)
            return res.status(400).json({ error: "The user ID already exists" });
    }
    next();
}
