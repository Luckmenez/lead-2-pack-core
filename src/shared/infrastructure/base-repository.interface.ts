export abstract class IBaseRepository<T> {
  abstract save(entity: T): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract update(id: string, entity: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
