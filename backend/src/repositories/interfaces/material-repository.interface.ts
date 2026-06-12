export interface IMaterialRepository {
  create(authorId: string, data: any): Promise<any>;
  findAll(userRole: string): Promise<any[]>;
  findOne(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
  remove(id: string): Promise<any>;
}
