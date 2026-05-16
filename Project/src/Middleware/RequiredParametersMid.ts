import { Request, Response, NextFunction } from "express";

/**
 * Middleware that validates all required fields are present in the request body
 * before the registration handler runs. Keeps validation logic out of the route handler.
 */
export function RequiredParametersInUser(req: Request, res: Response, next: NextFunction) {
    const user = req.body;
    if (!user) {
        return res.status(401).json({ error: "No parameters entered!" });
    }
    if (!user.userId) {
        return res.status(400).json({ error: "Missing required parameter: userId" });
    }
    if (!user.name) {
        return res.status(400).json({ error: "Missing required parameter: name" });
    }
    if (!user.phone) {
        return res.status(400).json({ error: "Missing required parameter: phone" });
    }
    if (!user.password) {
        return res.status(400).json({ error: "Missing required parameter: password" });
    }
    next();
}

/**
 * Middleware that validates all required fields are present before creating a prompt.
 * Ensures category_id, sub_category_id, and prompt are provided in the request body.
 */
export function RequiredParametersInPrompt(req: Request, res: Response, next: NextFunction) {
    const { category_id, sub_category_id, prompt } = req.body;
    if (!category_id) {
        return res.status(400).json({ error: "Missing required parameter: category_id" });
    }
    if (!sub_category_id) {
        return res.status(400).json({ error: "Missing required parameter: sub_category_id" });
    }
    if (!prompt) {
        return res.status(400).json({ error: "Missing required parameter: prompt" });
    }
    next();
}

/**
 * Middleware that validates the name field is present before creating a category.
 */
export function RequiredParametersInCategory(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Missing required parameter: name" });
    }
    next();
}

/**
 * Middleware that validates name and category_id are present before creating a sub-category.
 */
export function RequiredParametersInSubCategory(req: Request, res: Response, next: NextFunction) {
    const { name, category_id } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Missing required parameter: name" });
    }
    if (!category_id) {
        return res.status(400).json({ error: "Missing required parameter: category_id" });
    }
    next();
}
