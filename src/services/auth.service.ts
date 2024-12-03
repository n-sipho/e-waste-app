import { UserModel } from "../models/user.model";
import { User } from "../types/interfaces";
import { ApiError } from "../utils/api-error";
import { generateToken } from "../utils/auth-helper";
import { logger } from "../utils/logger";
import { hashSync, compareSync, compare, hash, genSalt } from "bcryptjs";

export class AuthService {
    static createAccount = async (data: User) => {
        const salt = await genSalt();
        console.log(data.password);
        
        const hashedPassword = await hash(data.password, salt);
        console.log(hashedPassword);
        
        data.password = hashedPassword;
        const results = await UserModel.createUser(data);
        const user = results[0];
        const token = generateToken(user);
        logger.info(`User ${user.email} created successfully`);
        return { token, email: user.email, type: user.type };
    }

    static login = async (email: string, password: string) => {
        const results = await UserModel.getUserByEmail(email);
        const user = results[0];

        if (!user) {
            throw new ApiError('Account not found', 404);
        }

        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            throw new ApiError('Invalid email or password', 401);
        }

        const token = generateToken(user);
        return { token, email: user.email, type: user.type };

    }
}