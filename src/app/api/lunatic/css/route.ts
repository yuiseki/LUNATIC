import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { runLunaticCssChain } from "@/utils/langchain/chains/lunatic";

export async function POST(request: Request) {
  const res = await request.json();
  const currentCss = res.currentCss;
  const pastMessagesJsonString = res.pastMessagesJsonString;

  let chatHistory: string[] = [];
  if (pastMessagesJsonString && pastMessagesJsonString !== "undefined") {
    const pastMessages: {
      messages: Array<{ type: string; data: { content: string } }>;
    } = JSON.parse(pastMessagesJsonString);
    chatHistory = pastMessages.messages.map((message, idx) => {
      if (message.data.content) {
        if (idx === 0 || idx % 2 === 0) {
          return `Human: ${message.data.content}`;
        } else {
          return `AI: ${message.data.content}`;
        }
      } else {
        return "";
      }
    });
  }

  console.log("----- ----- -----");
  console.log("----- css -----");
  console.log("----- ----- -----");
  console.log(chatHistory.join("\n"));
  console.log("");

  try {
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
      maxTokens: 2000,
      // See surface/route.ts: force fetch so the openai SDK doesn't try its
      // Node HTTP transport, which isn't supported under Workers.
      configuration: { fetch: globalThis.fetch },
    });
    const result = await runLunaticCssChain({
      llm: model,
      chat_history: chatHistory.join("\n"),
    });
    console.log(result.text);
    return NextResponse.json({
      css: result.text,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      css: undefined,
    });
  }
}
