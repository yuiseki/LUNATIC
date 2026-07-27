import { LUNATIC_CSS_PROMPT, LUNATIC_SURFACE_PROMPT } from "./prompts";

// A minimal structural type for the one method we use. Typing this against
// @langchain/core's full `BaseChatModel<CallOptions>` generic class makes
// TypeScript try to check ChatOpenAI's large call-options type against it and
// blow the type-instantiation depth limit.
interface InvokableChatModel {
  invoke(input: string): Promise<{ content: unknown }>;
}

export const runLunaticSurfaceChain = async ({
  llm,
  input,
  history,
}: {
  llm: InvokableChatModel;
  input: string;
  history: string;
}): Promise<{ response: string }> => {
  const prompt = await LUNATIC_SURFACE_PROMPT.format({ history, input });
  const result = await llm.invoke(prompt);
  return { response: String(result.content) };
};

export const runLunaticCssChain = async ({
  llm,
  chat_history,
}: {
  llm: InvokableChatModel;
  chat_history: string;
}): Promise<{ text: string }> => {
  const prompt = await LUNATIC_CSS_PROMPT.format({ chat_history });
  const result = await llm.invoke(prompt);
  return { text: String(result.content) };
};
