import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import { ApiError } from "../utils/api-error";

export class UserMiddleware {
    static checkIfUserExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const results = await UserModel.getUserByEmail(email);
            const user = results[0];
            if (user) {
                throw new ApiError("User already exists", 400);
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}