import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
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
