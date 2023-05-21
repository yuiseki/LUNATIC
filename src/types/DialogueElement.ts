import { Document } from "@/types/Document";

export type DialogueElement = {
  who: string;
  text: string;
  emojiList: Array<{ name: string; count: number }>;
  textEnd?: string;
  docs?: Document[];
};
