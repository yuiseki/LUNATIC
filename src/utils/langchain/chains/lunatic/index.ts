import { ConversationChain } from "langchain/chains";
import { LUNATIC_CSS_PROMPT, LUNATIC_SURFACE_PROMPT } from "./prompts";
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

export const loadLunaticCssChain = ({
  llm,
}: {
  llm: BaseLanguageModel;
}): LLMChain => {
  const chain = new LLMChain({
    llm: llm,
    prompt: LUNATIC_CSS_PROMPT,
  });
  return chain;
};
