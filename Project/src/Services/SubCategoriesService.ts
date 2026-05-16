import { ISubCategories, SubCategories } from '../Models/SubCategoriesModel';
import { Types } from 'mongoose';

export class SubCategoriesService {

    async createSubCategories(newSubCategories: { name: string, category_id: Types.ObjectId }): Promise<ISubCategories> {
        return await SubCategories.create(newSubCategories);
    }

    async getSubCategoriesByCategory(categoryId: string): Promise<ISubCategories[]> {
        const subCategories = await SubCategories.find({ category_id: categoryId }).populate('category_id').exec();
        if (!subCategories) throw new Error('Could not get sub_categories by category!');
        return subCategories;
    }

}

export const subCategoriesService = new SubCategoriesService();
