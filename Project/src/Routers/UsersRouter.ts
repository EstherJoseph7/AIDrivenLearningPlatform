import { Router, Request, Response } from 'express';
import { authenticateToken } from '../Middleware/AuthenticationMid';
import { subCategoriesService } from '../Services/SubCategoriesService';
import { logger } from "../Utils/Logger";
import { categoriesService } from '../Services/CategoriesService';
import { promptsService } from '../Services/PromptsService';
import { generateLesson } from '../Utils/AIService';
import { RequiredParametersInPrompt } from '../Middleware/RequiredParametersMid';

export const router = Router();

router.use(authenticateToken);

// GET /user/categories - get all available categories
router.get('/categories', async (req: Request, res: Response) => {
    try {
        const categories = await categoriesService.getCategories();
        if (!categories || categories.length === 0) {
            res.status(404).json({ error: 'No categories found.' });
            return;
        }
        res.status(200).json(categories);
    } catch (error: any) {
        logger.error(`Failed to get categories: ${error.message}`);
        res.status(500).json({ error: error?.message });
    }
});

// GET /user/subcategories/:category_id - get sub-categories by category
router.get('/subcategories/:category_id', async (req: Request, res: Response) => {
    const category_id = req.params.category_id as string;
    try {
        const subCategories = await subCategoriesService.getSubCategoriesByCategory(category_id);
        if (!subCategories || subCategories.length === 0) {
            res.status(404).json({ error: 'No subCategories found.' });
            return;
        }
        res.status(200).json(subCategories);
    } catch (error: any) {
        logger.error(`Failed to get subCategories: ${error.message}`);
        res.status(500).json({ error: error?.message });
    }
});

// POST /user/prompts - send a prompt to AI and save the generated lesson
router.post('/prompts', RequiredParametersInPrompt, async (req: Request, res: Response) => {
    const { category_id, sub_category_id, prompt } = req.body;
    const user_id = (req as any).user.id;
    try {
        const category = await categoriesService.getCategoryById(category_id);
        const categoryName = category?.name ?? category_id;
        const response = await generateLesson(categoryName, prompt);
        const newPrompt = { user_id, category_id, sub_category_id, prompt, response };
        const createdPrompt = await promptsService.createPrompts(newPrompt);
        logger.debug('Prompt was created successfully');
        res.status(201).json(createdPrompt);
    } catch (error: any) {
        logger.error(`Failed to create prompt: ${error.message}`);
        res.status(500).json({ error: error?.message });
    }
});

// GET /user/prompts/my-history - get the learning history of the logged-in user
router.get('/prompts/my-history', async (req: Request, res: Response) => {
    try {
        const myPrompts = await promptsService.getPromptsByUser((req as any).user.id);
        if (!myPrompts || myPrompts.length === 0) {
            res.status(404).json({ error: 'No prompts found for this user.' });
            return;
        }
        logger.debug('Prompts history retrieved successfully');
        res.status(200).json(myPrompts);
    } catch (error: any) {
        logger.error(`Failed to get my prompts: ${error.message}`);
        res.status(500).json({ error: error?.message });
    }
});
