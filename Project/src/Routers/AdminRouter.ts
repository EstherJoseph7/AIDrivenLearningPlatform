import { Router, Request, Response } from 'express';
import { authenticateToken } from '../Middleware/AuthenticationMid';
import { AuthorizedAdmin } from '../Middleware/AuthorizationMid';
import { logger } from "../Utils/Logger";
import { promptsService } from '../Services/PromptsService';
import { userService } from '../Services/UserService';
import { categoriesService } from '../Services/CategoriesService';
import { subCategoriesService } from '../Services/SubCategoriesService';
import { RequiredParametersInCategory, RequiredParametersInSubCategory } from '../Middleware/RequiredParametersMid';
export const router = Router();

router.use(authenticateToken);
router.use(AuthorizedAdmin);

// GET /admin/users - list all users with pagination
router.get('/users', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await userService.getUsersPaginated(page, limit);
        if (!result.users || result.users.length === 0) {
            res.status(404).json({ error: 'No users found.' });
            return;
        }
        res.status(200).json(result);
    } catch (error: any) {
        logger.error(`Failed to get users: ${error.message}`);
        res.status(500).json({ error: error?.message });
    }
});

// GET /admin/prompts - get all prompts history with pagination
router.get('/prompts', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await promptsService.getPromptsPaginated(page, limit);
        if (!result.prompts || result.prompts.length === 0) {
            res.status(404).json({ error: 'No prompts found.' });
            return;
        }
        res.status(200).json(result);
    } catch (error: any) {
        logger.error(`Failed to get prompts: ${error.message}`);
        res.status(500).json({ error: error?.message });
    }
});

// GET /admin/prompts/:user_id - get prompt history by user
router.get('/prompts/:user_id', async (req: Request, res: Response) => {
    try {
        const user_id = req.params.user_id as string;
        const prompts = await promptsService.getPromptsByUser(user_id);
        if (!prompts || prompts.length === 0) {
            res.status(404).json({ error: 'No prompts found for this user.' });
            return;
        }
        res.status(200).json(prompts);
    } catch (error: any) {
        logger.error(`Failed to get prompts for user: ${error.message}`);
        res.status(500).json({ error: error?.message });
    }
});

// POST /admin/categories - create a new category
router.post('/categories', RequiredParametersInCategory, async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const category = await categoriesService.createCategories({ name });
        res.status(201).json(category);
    } catch (error: any) {
        logger.error(`Failed to create category: ${error.message}`);
        res.status(500).json({ error: error?.message });
    }
});

// POST /admin/subcategories - create a new sub-category
router.post('/subcategories', RequiredParametersInSubCategory, async (req: Request, res: Response) => {
    const { name, category_id } = req.body;
    try {
        const subCategory = await subCategoriesService.createSubCategories({ name, category_id });
        res.status(201).json(subCategory);
    } catch (error: any) {
        logger.error(`Failed to create subCategory: ${error.message}`);
        res.status(500).json({ error: error?.message });
    }
});
