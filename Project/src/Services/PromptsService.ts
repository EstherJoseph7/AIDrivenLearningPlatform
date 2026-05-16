
import { IPrompts, Prompts } from '../Models/PromptsModel';
import { Types } from "mongoose";

export class PromptsService {

    async createPrompts(newPrompts: { user_id: string, category_id: Types.ObjectId, sub_category_id: Types.ObjectId, prompt: string, response: string }): Promise<IPrompts> {
        const prompts = await Prompts.create(newPrompts);
        return prompts;
    }

    async getPromptsPaginated(page: number, limit: number): Promise<{ prompts: IPrompts[], total: number, pages: number }> {
        const skip = (page - 1) * limit;
        const [prompts, total] = await Promise.all([
            Prompts.find().populate('category_id').populate('sub_category_id').skip(skip).limit(limit).exec(),
            Prompts.countDocuments()
        ]);
        return { prompts, total, pages: Math.ceil(total / limit) };
    }

    async getPromptsByUser(user_id: string): Promise<IPrompts[]> {
        const prompts = await Prompts.find({ user_id }).populate('category_id').populate('sub_category_id').exec();
        if (!prompts) throw new Error("Could not get prompts for user!");
        return prompts;
    }

}

export const promptsService = new PromptsService();
