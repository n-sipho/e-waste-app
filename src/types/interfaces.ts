import { Gender, UserType } from "./userEnums";

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
