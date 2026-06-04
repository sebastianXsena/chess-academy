import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';

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

  async findAll() {
    return this.prisma.material.findMany({
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findOne(id: string) {
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
    return material;
  }

  async update(id: string, dto: UpdateMaterialDto) {
    await this.findOne(id); // Ensure it exists
    return this.prisma.material.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure it exists
    return this.prisma.material.delete({
      where: { id },
    });
  }
}
