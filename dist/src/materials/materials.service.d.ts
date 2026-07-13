import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { Role } from '../auth/role.enum';
export declare class MaterialsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(authorId: string, dto: CreateMaterialDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        contentUrl: string | null;
        isPremium: boolean;
        authorId: string;
    }>;
    findAll(userRole: Role): Promise<({
        author: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        contentUrl: string | null;
        isPremium: boolean;
        authorId: string;
    })[]>;
    findOne(id: string, userRole: Role): Promise<{
        author: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        contentUrl: string | null;
        isPremium: boolean;
        authorId: string;
    }>;
    update(id: string, dto: UpdateMaterialDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        contentUrl: string | null;
        isPremium: boolean;
        authorId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        contentUrl: string | null;
        isPremium: boolean;
        authorId: string;
    }>;
}
