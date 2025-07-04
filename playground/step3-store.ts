type ChannelType = "text" | "voice";
interface User {
  readonly id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface Channel {
  readonly id: number;
  name: string;
  type: ChannelType;
  description?: string;
}

class UserEntity implements User {
  public readonly id: number;
  public name: string;
  public email: string;
  public isActive: boolean;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.isActive = true;
  }

  public getInfo(): string {
    return `${this.name}`;
  }

  public setActiveStatus(isActive: boolean): void {
    this.isActive = isActive;
  }
}

class ChannelEntity implements Channel {
  public readonly id: number;
  public name: string;
  public type: ChannelType;
  public description?: string;

  constructor(
    id: number,
    name: string,
    type: ChannelType,
    description?: string
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.description = description;
  }

  public getInfo(): string {
    return `${this.name}`;
  }

  public updateDescription(description: string): void {
    this.description = description;
  }
}

abstract class BaseStore {
  protected items: any[] = [];

  public getAll(): any[] {
    return [...this.items];
  }

  public count(): number {
    return this.items.length;
  }

  public clear(): void {
    this.items.length = 0;
  }
  abstract add(item: any): boolean;
  abstract findById(id: number): any | undefined;
  abstract remove(id: number): boolean;
}

class UserStore extends BaseStore {
  public add(user: UserEntity): boolean {
    if (!this.findById(user.id)) {
      this.items.push(user);
      return true;
    }
    return false;
  }

  public findById(id: number): UserEntity | undefined {
    return this.items.find((item) => item.id === id);
  }

  public remove(id: number): boolean {
    return false;
  }
}

class ChannelStore extends BaseStore {
  public add(channel: ChannelEntity): boolean {
    if (!this.findById(channel.id)) {
      this.items.push(channel);
      return true;
    }
    return false;
  }

  public findById(id: number): ChannelEntity | undefined {
    return this.items.find((item) => item.id === id);
  }

  public remove(id: number): boolean {
    return false;
  }
}

const userStore = new UserStore();
const channelStore = new ChannelStore();

userStore.add(new UserEntity(1, "Alice", "alice@example.com"));
userStore.add(new UserEntity(2, "Bob", "bob@example.com"));

channelStore.add(new ChannelEntity(1, "General", "text", "General discussion"));
channelStore.add(new ChannelEntity(2, "Random", "text", "Random topics"));

console.log("Users:", userStore.getAll() as UserEntity[]);
console.log("Channels:", channelStore.getAll() as ChannelEntity[]);

userStore.add(new UserEntity(1, "Homan", "homan@example.com"));

console.log("Users:", userStore.getAll() as UserEntity[]);

console.log("id 1のユーザー", userStore.findById(1));
