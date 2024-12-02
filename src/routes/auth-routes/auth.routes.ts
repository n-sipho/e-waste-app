import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { UserMiddleware } from "../../middlewares/user-middleware";

export const authRoutes = Router();

authRoutes.post("/createAccount", UserMiddleware.checkIfUserExists, async (req, res, next) => {
    await AuthController.handleCreateAccount(req, res, next);
});
