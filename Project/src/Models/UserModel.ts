import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Omit<Document, '_id'> {
  _id: string;
  name: string;
  phone: string;
  password: string;
  role:string;
}

const UserSchema = new Schema<IUser>({
  _id: {
    type: String,
    required: true,
    alias: 'userId',
    minLength: 9,
    maxlength: 9
  },
  name: { type: String, required: true },
  phone: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
},
  {
    _id: false,  
    versionKey: false,
    toJSON: {
      transform: (_doc: any, ret: any) => {
        ret.userId = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password; 
        return ret;
      }
    }
  });

export const User = mongoose.model<IUser>('User', UserSchema);