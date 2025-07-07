export interface WithId {
  id: string;
}

export abstract class BaseStore<T extends WithId> {
  entities: T[] = [];

  addItem(item: T): T[] {
    this.entities = [...this.entities, item];
    return this.entities;
  }

  getItemById(id: string): T | undefined {
    return this.entities.find((item) => item.id === id);
  }

  getAllItems(): T[] {
    return this.entities;
  }

  removeItemById(id: string): void {
    this.entities = this.entities.filter((item) => item.id !== id);
  }
}
