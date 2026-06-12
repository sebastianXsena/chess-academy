import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma/prisma.service';
import { IMaterialRepository } from '../interfaces/material-repository.interface';
import { Role } from '../../core/enums/role.enum';

@Injectable()
export class PrismaMaterialRepository implements IMaterialRepository {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, data: any) {
    return this.prisma.material.create({
      data: {
        ...data,
        authorId,
      },
    });
  }

  async findAll(userRole: string) {
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

  async findOne(id: string) {
    return this.prisma.material.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.material.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.material.delete({
      where: { id },
    });
  }
}
