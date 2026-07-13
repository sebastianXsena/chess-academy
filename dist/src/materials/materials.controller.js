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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const materials_service_1 = require("./materials.service");
const material_dto_1 = require("./dto/material.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
const swagger_1 = require("@nestjs/swagger");
let MaterialsController = class MaterialsController {
    materialsService;
    constructor(materialsService) {
        this.materialsService = materialsService;
    }
    create(req, createMaterialDto, file) {
        if (file) {
            createMaterialDto.contentUrl = `/uploads/${file.filename}`;
        }
        return this.materialsService.create(req.user.id, createMaterialDto);
    }
    findAll(req) {
        return this.materialsService.findAll(req.user.role);
    }
    findOne(req, id) {
        return this.materialsService.findOne(id, req.user.role);
    }
    update(id, updateMaterialDto, file) {
        if (file) {
            updateMaterialDto.contentUrl = `/uploads/${file.filename}`;
        }
        return this.materialsService.update(id, updateMaterialDto);
    }
    remove(id) {
        return this.materialsService.remove(id);
    }
};
exports.MaterialsController = MaterialsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, material_dto_1.CreateMaterialDto, Object]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, material_dto_1.UpdateMaterialDto, Object]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaterialsController.prototype, "remove", null);
exports.MaterialsController = MaterialsController = __decorate([
    (0, swagger_1.ApiTags)('materials'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('materials'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [materials_service_1.MaterialsService])
], MaterialsController);
//# sourceMappingURL=materials.controller.js.map