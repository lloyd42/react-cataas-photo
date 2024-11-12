import { create } from "zustand";

interface TagState {
  tags: string[];
  setTags: (tag: string) => void;
  delTags: (tag: string) => void;
}

export const useTagStore = create<TagState>()((set) => ({
  tags: [],
  setTags: (tag) =>
    set((state) => {
      state.tags.push(tag);
      return { tags: [...state.tags] };
    }),
  delTags: (tag) =>
    set((state) => {
      const filteredTags = state.tags.filter((i) => i != tag);
      return { tags: [...filteredTags] };
    }),
}));
