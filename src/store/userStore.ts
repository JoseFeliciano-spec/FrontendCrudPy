import { create } from "zustand";

export const userStore = create<any>(() => ({
  user: {},
}));
