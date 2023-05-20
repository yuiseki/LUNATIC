import { Document } from "@/types/Document";

export type DialogueElement = {
  who: string;
  text: string;
  textEnd?: string;
  docs?: Document[];
};
