import { MaterialsService } from './materials.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
export declare class MaterialsController {
    private readonly materialsService;
    constructor(materialsService: MaterialsService);
    create(req: any, createMaterialDto: CreateMaterialDto, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        contentUrl: string | null;
        isPremium: boolean;
        authorId: string;
    }>;
    findAll(req: any): Promise<({
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
    findOne(req: any, id: string): Promise<{
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
    update(id: string, updateMaterialDto: UpdateMaterialDto, file: Express.Multer.File): Promise<{
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
