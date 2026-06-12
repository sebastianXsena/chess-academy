import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './config/prisma/prisma.module';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { UsersService } from './services/users.service';
import { MaterialsService } from './services/materials.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { MaterialsController } from './controllers/materials.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaUserRepository } from './repositories/implementations/prisma-user.repository';
import { PrismaMaterialRepository } from './repositories/implementations/prisma-material.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    MaterialsController,
  ],
  providers: [
    AppService,
    UsersService,
    AuthService,
    MaterialsService,
    JwtStrategy,
    { provide: 'IUserRepository', useClass: PrismaUserRepository },
    { provide: 'IMaterialRepository', useClass: PrismaMaterialRepository },
  ],
})
export class AppModule {}
