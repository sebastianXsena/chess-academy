export interface IUserRepository {
  findAll(): Promise<any[]>;
  findByEmail(email: string): Promise<any | null>;
  create(data: any): Promise<any>;
}
