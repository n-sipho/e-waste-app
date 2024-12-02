import { WasteDonorService } from "../services/waste-donor.service";
import { Request, Response, NextFunction } from "express";
import { Gender, UserType } from "../types/userEnums";
import { AuthService } from "../services/auth.service";

export class AuthController {
    static handleCreateAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const user = await AuthService.createWasteDonorAccount(data);
            return res.status(201).json({
                message: "Waste donor account created successfully",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }
}