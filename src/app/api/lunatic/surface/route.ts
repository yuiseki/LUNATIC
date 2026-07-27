import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { runLunaticSurfaceChain } from "@/utils/langchain/chains/lunatic";

type StoredMessage = { type: "human" | "ai"; data: { content: string } };

export async function POST(request: Request) {
  const res = await request.json();
  const query = res.query;
  const pastMessagesJsonString = res.pastMessagesJsonString;

  let pastMessages: StoredMessage[] = [];
  if (pastMessagesJsonString && pastMessagesJsonString !== "undefined") {
    const parsed: { messages: StoredMessage[] } = JSON.parse(
      pastMessagesJsonString
    );
    pastMessages = parsed.messages;
  }

  const history = pastMessages
    .map((message) =>
      message.type === "ai"
        ? `AI: ${message.data.content}`
        : `Human: ${message.data.content}`
    )
    .join("\n");

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    maxTokens: 2000,
    // The openai SDK's Node transport detection misfires under Workers'
    // nodejs_compat (process is defined, so it skips the native fetch path)
    // and hangs / errors with "Connection error." Force fetch explicitly.
    configuration: { fetch: globalThis.fetch },
  });
  const surfaceResult = await runLunaticSurfaceChain({
    llm: model,
    input: query,
    history,
  });

  console.log("----- ----- -----");
  console.log("----- surface -----");
  console.log("----- ----- -----");
  console.log("Human:", query);
  console.log("AI:", surfaceResult.response);
  console.log("");

  const newMessages: StoredMessage[] = [
    ...pastMessages,
    { type: "human", data: { content: query } },
    { type: "ai", data: { content: surfaceResult.response } },
  ];

  return NextResponse.json({
    query: query,
    surface: surfaceResult.response,
    history: { messages: newMessages },
  });
}
