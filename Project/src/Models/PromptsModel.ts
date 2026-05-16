import mongoose, { Document, Schema, Types } from 'mongoose';


export interface IPrompts extends Document {
    user_id: string,
    category_id: Types.ObjectId,   
    sub_category_id: Types.ObjectId, 
    prompt: string,
    response: string,
    created_at: Date
}

const prompts_schema = new Schema<IPrompts>(
    {
        user_id: { type: String, required: true },
        category_id: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
        sub_category_id: { type: Schema.Types.ObjectId, ref: 'subCategories', required: true },
        prompt: { type: String, required: true },
        response: { type: String, required: true },
        created_at: { type: Date, default: Date.now }
    },
    {
        toJSON: {
            transform: (_doc: any, ret: any) => {
                delete ret.__v;
                return ret;
            }
        }
    }
)

export const Prompts = mongoose.model<IPrompts>('prompts', prompts_schema);