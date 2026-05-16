import { Router, Request, Response } from 'express';
import { validatePassword, checkUser } from '../../Middleware/UserValidationMid'
import { RequiredParametersInUser } from '../../Middleware/RequiredParametersMid';
import { userService } from '../../Services/UserService';
import { AuthService } from './JwtUtils';
import { logger } from "../../Utils/Logger";
import bcrypt from 'bcrypt';
import { User } from '../../Models/UserModel';

export const router = Router();

const authService = new AuthService();

router.post('/register', validatePassword, RequiredParametersInUser, checkUser, async (req: Request, res: Response) => {

    try {
        const { userId, name, phone, password, adminSecret } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        if (adminSecret !== undefined && adminSecret !== process.env.ADMIN_SECRET) {
            return res.status(400).json({ error: 'Invalid admin secret.' });
        }
        const role = adminSecret === process.env.ADMIN_SECRET ? 'admin' : 'user';
        const newUser: any = { _id: userId, name, phone, password: hashedPassword, role };
        const user = await userService.createUser(newUser);
        res.status(201).json(user);
    }
    catch (error: any) {
        logger.error(`Failed to register user: ${error.message}`);
        res.status(500).json({ error: error?.message });
    }
});

router.post("/login", async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password) {
        return res.status(400).json({ error: "Id and password required!" });
    }
    if (userId.length !== 9) {
        return res.status(400).json({ error: "ID must be exactly 9 digits" });
    }
    const user = await User.findById(userId);
    if (!user) {
        logger.debug("Failed login attempt");
        return res.status(401).json({ error: "The user doesn't exist in the system." });
    }
    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        logger.debug("Failed login attempt");
        return res.status(401).json({ error: "You entered the wrong password" });
    }
    const token = authService.generateToken(userId, user.role);
    logger.info(`User: ${user._id} logged in -> token issued.`);
    return res.json({ token: `Bearer ${token}` });
});