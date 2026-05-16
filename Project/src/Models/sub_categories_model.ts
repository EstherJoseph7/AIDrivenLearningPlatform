import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISubCategories extends Document {
    name: string;
    category_id: Types.ObjectId;
}

const sub_categories_schema = new Schema<ISubCategories>(
    {
        name: { type: String, required: true },
        category_id: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
    },
    {
        toJSON: {
            virtuals: true,
            transform: (_doc: any, ret: any) => {
                delete ret.__v;
                return ret;
            }
        }
    }
)

export const SubCategories = mongoose.model<ISubCategories>('subCategories', sub_categories_schema);