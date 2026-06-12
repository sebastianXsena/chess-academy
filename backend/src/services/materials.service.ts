import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { IMaterialRepository } from '../repositories/interfaces/material-repository.interface';
import { Role } from '../core/enums/role.enum';
import { CreateMaterialDto, UpdateMaterialDto } from '../dto/material.dto';

@Injectable()
export class MaterialsService {
  constructor(
    @Inject('IMaterialRepository')
    private readonly materialRepository: IMaterialRepository,
  ) {}

  async create(authorId: string, dto: CreateMaterialDto) {
    return this.materialRepository.create(authorId, dto);
  }

  async findAll(userRole: Role) {
    return this.materialRepository.findAll(userRole);
  }

  async findOne(id: string, userRole: Role) {
    const material = await this.materialRepository.findOne(id);

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    if (material.isPremium && userRole === Role.USER) {
      throw new ForbiddenException(
        'Este contenido es exclusivo para estudiantes. Inscríbete en un curso para acceder.',
      );
    }

    return material;
  }

  async update(id: string, dto: UpdateMaterialDto) {
    await this.findOne(id, Role.ADMIN);
    return this.materialRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id, Role.ADMIN);
    return this.materialRepository.remove(id);
  }
}
