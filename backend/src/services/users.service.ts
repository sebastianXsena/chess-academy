import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../repositories/interfaces/user-repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll() {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async create(data: any) {
    return this.userRepository.create(data);
  }
}
