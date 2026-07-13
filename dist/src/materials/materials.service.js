"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../auth/role.enum");
let MaterialsService = class MaterialsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(authorId, dto) {
        return this.prisma.material.create({
            data: {
                ...dto,
                authorId,
            },
        });
    }
    async findAll(userRole) {
        const where = userRole === role_enum_1.Role.USER ? { isPremium: false } : {};
        return this.prisma.material.findMany({
            where,
            include: {
                author: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
    }
    async findOne(id, userRole) {
        const material = await this.prisma.material.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
        if (!material) {
            throw new common_1.NotFoundException('Material not found');
        }
        if (material.isPremium && userRole === role_enum_1.Role.USER) {
            throw new common_1.ForbiddenException('Este contenido es exclusivo para estudiantes. Inscríbete en un curso para acceder.');
        }
        return material;
    }
    async update(id, dto) {
        await this.findOne(id, role_enum_1.Role.ADMIN);
        return this.prisma.material.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id) {
        await this.findOne(id, role_enum_1.Role.ADMIN);
        return this.prisma.material.delete({
            where: { id },
        });
    }
};
exports.MaterialsService = MaterialsService;
exports.MaterialsService = MaterialsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaterialsService);
//# sourceMappingURL=materials.service.js.map