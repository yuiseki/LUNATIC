import { test } from "node:test";
import assert from "node:assert/strict";
import { runLunaticCssChain, runLunaticSurfaceChain } from "../index";

test("runLunaticSurfaceChain formats the prompt and returns the model's reply", async () => {
  const seenPrompts: string[] = [];
  const llm = {
    async invoke(prompt: string) {
      seenPrompts.push(prompt);
      return { content: "AI reply" };
    },
  };

  const result = await runLunaticSurfaceChain({
    llm,
    input: "hello",
    history: "Human: hi\nAI: yo",
  });

  assert.equal(result.response, "AI reply");
  assert.equal(seenPrompts.length, 1);
  assert.match(seenPrompts[0], /Current conversation:\nHuman: hi\nAI: yo/);
  assert.match(seenPrompts[0], /Human: hello\nAI:$/);
});

test("runLunaticCssChain formats the prompt and returns the model's CSS", async () => {
  const llm = {
    async invoke() {
      return { content: "```\n.foo { color: red; }\n```" };
    },
  };

  const result = await runLunaticCssChain({
    llm,
    chat_history: "Human: make it red",
  });

  assert.equal(result.text, "```\n.foo { color: red; }\n```");
});
