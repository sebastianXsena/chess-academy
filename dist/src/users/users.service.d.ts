import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findByEmail(email: string): Promise<{
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
    } | null>;
    create(data: any): Promise<{
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
    }>;
}
