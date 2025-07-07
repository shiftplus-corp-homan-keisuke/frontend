import { atom, useAtom } from "jotai";
import { BaseStore, type WithId } from "./base-store";

class User implements WithId {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  constructor(id: string, firstName: string, lastName: string, email: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

class UserStore extends BaseStore<User> {}

const userStore = new UserStore();

const userAtom = atom(userStore.entities);

const useUserState = () => {
  const [users, setUsers] = useAtom(userAtom);
  return [users, userStore, setUsers] as const;
};

export { User, UserStore, userStore, userAtom, useUserState };
