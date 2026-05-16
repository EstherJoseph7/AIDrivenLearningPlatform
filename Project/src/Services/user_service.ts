import { User, IUser } from '../Models/user_model';

export class UserService {

    async createUser(newUser: { _id: string, name: string, phone: string, password: string, role: string }): Promise<IUser> {
        const user = await User.create(newUser);
        return user;
    }
    async getUsers(): Promise<IUser[] | null> {
        const users = await User.find().exec();
        if (!users) throw new Error("Could not find users!");
        return users;
    }

    async getUsersPaginated(page: number, limit: number): Promise<{ users: IUser[], total: number, pages: number }> {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find().skip(skip).limit(limit).exec(),
            User.countDocuments()
        ]);
        return { users, total, pages: Math.ceil(total / limit) };
    }

}

export const userService = new UserService();