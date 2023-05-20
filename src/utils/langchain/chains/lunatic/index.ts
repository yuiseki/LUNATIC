import { ConversationChain } from "langchain/chains";
import { LUNATIC_SURFACE_PROMPT } from "./prompts";
import { LLMChain } from "langchain/chains";
import { BaseLanguageModel } from "langchain/dist/base_language";
import { BaseMemory, BufferMemory } from "langchain/memory";

export const loadLunaticSurfaceChain = ({
  llm,
  memory,
}: {
  llm: BaseLanguageModel;
  memory?: BaseMemory;
}): LLMChain => {
  if (memory === undefined) {
    memory = new BufferMemory();
  }
  const chain = new ConversationChain({
    llm: llm,
    prompt: LUNATIC_SURFACE_PROMPT,
    memory: memory,
  });
  return chain;
};
