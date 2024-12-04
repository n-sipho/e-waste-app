import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../services/auth.service";
import { ApiResponse } from "../../utils/api-response";
import { LoginData } from "./user";
import { User } from "../../types/interfaces";

export class AuthController {
    static handleCreateAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: User = req.body;
            const resp = await AuthService.createAccount(data);

            return new ApiResponse(201).success('Account created successfully', resp, res);
        } catch (error) {
            next(error);
        }
    }

    static handleLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: LoginData = req.body;
            const resp = await AuthService.login(data.email, data.password);

            return new ApiResponse(200).success('Login successful', resp, res);
        } catch (error) {
            next(error);
        }
    }
}