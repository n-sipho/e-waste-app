import { Gender, UserType } from "./user-enums";

export interface User {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: string;
    address: string;
    gender: Gender;
    type: UserType;
    created_at: Date;
    updated_at: Date;
}
