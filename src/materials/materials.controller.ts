import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('materials')
@ApiBearerAuth()
@Controller('materials')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Request() req, @Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.create(req.user.id, createMaterialDto);
  }

  @Get()
  // USER ve solo materiales gratuitos; STUDENT y ADMIN ven todo
  findAll(@Request() req) {
    return this.materialsService.findAll(req.user.role);
  }

  @Get(':id')
  // USER puede acceder, pero el service lanza 403 si el material es premium
  findOne(@Request() req, @Param('id') id: string) {
    return this.materialsService.findOne(id, req.user.role);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
    return this.materialsService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.materialsService.remove(id);
  }
}
