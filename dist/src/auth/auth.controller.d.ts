import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            username: string;
            role: import("@prisma/client").$Enums.Role;
            age: number | null;
            city: string | null;
            phone: string | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            username: string;
            role: import("@prisma/client").$Enums.Role;
            age: number | null;
            city: string | null;
            phone: string | null;
        };
    }>;
}
