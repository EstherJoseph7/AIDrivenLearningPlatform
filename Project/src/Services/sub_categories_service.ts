import { ISubCategories, SubCategories } from '../Models/sub_categories_model';
import { Types } from 'mongoose';

export class SubCategoriesService {

    async createSubCategories(newSubCategories: { name: string, category_id: Types.ObjectId }): Promise<ISubCategories> {
        return await SubCategories.create(newSubCategories);
    }

    async getSubCategories(): Promise<ISubCategories[]> {
        const subCategories = await SubCategories.find().populate('category_id').exec();
        if (!subCategories) throw new Error('Could not get sub_categories!');
        return subCategories;
    }

    async getSubCategoriesByCategory(categoryId: string): Promise<ISubCategories[]> {
        const subCategories = await SubCategories.find({ category_id: categoryId }).populate('category_id').exec();
        if (!subCategories) throw new Error('Could not get sub_categories by category!');
        return subCategories;
    }

    async updateSubCategories(id: string, name: string, categoryId: Types.ObjectId): Promise<ISubCategories | null> {
        const subCategory = await SubCategories.findById(id).exec();
        if (subCategory) {
            subCategory.name = name;
            subCategory.category_id = categoryId;
            await subCategory.save();
        }
        return subCategory;
    }

}

export const subCategoriesService = new SubCategoriesService();
