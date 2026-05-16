import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

/*
  Handles JWT token generation and verification.
  Tokens expire after 7 days and contain the user's id and role.
 */
export class AuthService {

    generateToken(id: string, role: string): string {
        const payload = { id, role };
        return jwt.sign(payload, SECRET_KEY!, { expiresIn: "7d" });
    }

    verifyToken(token: string): any {
        return jwt.verify(token, SECRET_KEY!);
    }
}