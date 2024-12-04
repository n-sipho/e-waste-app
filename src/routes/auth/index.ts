import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { UserMiddleware } from "../../middlewares/user-middleware";
import { validateLogin, validateSignup } from "../../utils/validation-middleware";

export const authRoutes = Router();

authRoutes.post("/createAccount", validateSignup, UserMiddleware.checkIfUserExists, async (req, res, next) => {
    await AuthController.handleCreateAccount(req, res, next);
});

authRoutes.post("/login", validateLogin, async (req, res, next) => {
    await AuthController.handleLogin(req, res, next);
});
