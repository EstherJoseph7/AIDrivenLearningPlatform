import { ICategories, Categories } from '../Models/categories_model';
export class CategoriesService {

    async createCategories(newCategories: { name: string }): Promise<ICategories> {
        const category = new Categories(newCategories);
        return await category.save();
    }

    async getCategories(): Promise<ICategories[] | null> {
        const categories = await Categories.find().exec();
        if (!categories) throw new Error("Could not find categories!");
        return categories;
    }

    async getCategoryById(id: string): Promise<ICategories | null> {
        return await Categories.findById(id).exec();
    }

}

export const categoriesService = new CategoriesService();