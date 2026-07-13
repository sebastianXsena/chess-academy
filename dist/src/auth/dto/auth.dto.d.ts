export declare class RegisterDto {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    age?: number;
    city?: string;
    phone?: string;
    password: string;
    passwordConfirm?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
