import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { Role } from '../auth/role.enum';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, dto: CreateMaterialDto) {
    return this.prisma.material.create({
      data: {
        ...dto,
        authorId,
      },
    });
  }

  async findAll(userRole: Role) {
    // USER solo ve contenido gratuito; ADMIN y STUDENT ven todo
    const where = userRole === Role.USER ? { isPremium: false } : {};

    return this.prisma.material.findMany({
      where,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findOne(id: string, userRole: Role) {
    const material = await this.prisma.material.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    // Si el material es premium y el usuario es USER, denegar acceso
    if (material.isPremium && userRole === Role.USER) {
      throw new ForbiddenException(
        'Este contenido es exclusivo para estudiantes. Inscríbete en un curso para acceder.',
      );
    }

    return material;
  }

  async update(id: string, dto: UpdateMaterialDto) {
    await this.findOne(id, Role.ADMIN); // ADMIN siempre tiene acceso
    return this.prisma.material.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id, Role.ADMIN); // ADMIN siempre tiene acceso
    return this.prisma.material.delete({
      where: { id },
    });
  }
}
