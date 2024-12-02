import { UserModel } from "../models/user.model";
import { User } from "../types/interfaces";
import { ApiError } from "../utils/api-error";

export class WasteDonorService {
    static createWasteDonorAccount = async (data: User) => {
        try {
            const insertResults = await UserModel.createUser(data);
            if (insertResults.length > 0) {
                return insertResults;
            }
        } catch (error) {
            throw new ApiError('Failed to create waste donor account', 500);
        }
    }
}