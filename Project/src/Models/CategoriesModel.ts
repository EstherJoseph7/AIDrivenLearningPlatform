import mongoose, { Document, Schema } from 'mongoose';

export interface ICategories extends Document {
    name: string;
}

const categoriesSchema = new Schema<ICategories>(
    {
        name: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export const Categories = mongoose.model<ICategories>('categories', categoriesSchema);
