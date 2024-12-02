import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import { ApiError } from "../utils/api-error";

export class UserMiddleware {
    static checkIfUserExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const user = await UserModel.getUserByEmail(email);
            if (user.length > 0) {
                throw new ApiError("User already exists", 400);
            } else {
                next();
            }
        } catch (error) {
            next(error);
        }
    }
}