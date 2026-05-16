import { User, IUser } from '../Models/UserModel';

export class UserService {

    async createUser(newUser: { _id: string, name: string, phone: string, password: string, role: string }): Promise<IUser> {
        const user = await User.create(newUser);
        return user;
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