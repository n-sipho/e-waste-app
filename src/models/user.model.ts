import db from "../db/database"
import { User } from "../types/interfaces"

export class UserModel {
    static createUser = async (user: User) => {
        return await db.insert(user).into("users").returning("*");
    }
    static getUserByEmail = async (email: string) => {
        return await db("users").where({ email });
    }
}