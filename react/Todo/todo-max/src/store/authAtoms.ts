import { atom } from "jotai";
import type { User } from "../types/auth";

export const currentUserAtom = atom<User | null>(null);
