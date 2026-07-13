import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        active: boolean;
        age: number | null;
        city: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
