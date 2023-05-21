import { PromptTemplate } from "langchain/prompts";

export const LUNATIC_SURFACE_PROMPT = new PromptTemplate({
  template: `Your name is LUNATIC, You are an interactive web site reconstructing assistant. You interact with the human, asking step-by-step about the concerns of the web site they want to create.

You will always reply according to the following rules:
- You MUST ALWAYS confirm with the human the concerns covered by the web site.
- If the human does not indicate any concerns of the web site, you need to check with the human.
- When you get above information from human, you will reply "I copy! I'm reconstructing web site that shows {{all concerns of web site}}. Please wait a while..." in the language which human is writing.
- If human want to change, expand, limit, delete, reset or clear maps, you will carefully reply "I copy! I'm reconstructing web site that shows {{all areas and all concerns should includes maps}}. Please wait a while..." in the language which human is writing.
- When human want to add or expand web site, Do not forget previous areas and concerns.
- Without when human want to remove, delete or limit web site, Do not forget previous areas and concerns.
- You MUST ALWAYS reply in the language which human is writing.
- You MUST NOT reply in any language other than the language written by the human.
- You reply with the most accurate grammar possible.

Current conversation:
{history}
Human: {input}
AI:`,
  inputVariables: ["history", "input"],
});

const cssClassNames = [
  "dialogueListWrap",
  "dialogueElementItem",
  "dialogueElementItemAssistant",
  "dialogueElementItemHuman",
  "avatarIconWrap",
  "avatarIcon",
  "dialogueElementWrap",
  "dialogueTextWrap",
  "dialogueTextRow",
  "dialogueEmojiListWrap",
  "emojiWrap",
  "emoji",
  "emojiCount",
  "textInputWrap",
  "textInput",
  "textInputTextarea",
  "textInputButton",
];
const exampleHello = `
Input text:
Human: こんにちは。何ができますか？
Output:
\`\`\`
@keyframes keyframe-opacity-blinking {{
  0% {{ opacity: 0; }}
  50% {{ opacity: 1; }}
  100% {{ opacity: 0; }}
}}
@keyframes keyframe-transform-rotate-clockwise {{
  0% {{ transform: rotate(0); }}
  100% {{ transform: rotate(360deg); }}
}}
@keyframes keyframe-transform-horizontally-swaying {{
  0% {{ transform: translate(-15px, 0); }}
  50% {{ transform: translate(15px, 0); }}
  100% {{ transform: translate(-15px, 0); }}
}}
@keyframes keyframe-transform-vertically-swinging {{
  0% {{ transform: translate(0, 0px); }}
  50% {{ transform: translate(0, -30px); }}
  100% {{ transform: translate(0, 0px); }}
}}
@keyframes keyframe-transform-bigger-smaller-bounce {{
  0% {{ transform: scale(0.5); }}
  50% {{ transform: scale(1.2); }}
  100% {{ transform: scale(0.5); }}
}}
@keyframes keyframe-transform-bigger-smaller-bounce-and-rotate-clockwise {{
  0% {{ transform: scale(0.5) rotate(0); }}
  50% {{ transform: scale(1.2) rotate(180deg); }}
  100% {{ transform: scale(0.5) rotate(360deg); }}
}}
.avatarIcon {{
  border-radius: 50%;
  animation: keyframe-transform-bigger-smaller-bounce-and-rotate-clockwise 1s linear infinite;
}}
.avatarIcon img {{
  border-radius: 50%;
}}
.dialogueElementItem {{
  animation: keyframe-transform-horizontally-swaying 5s linear infinite;
  background-color: #23232f;
  border-color: #ff728a;
}}
.dialogueElementItemHuman {{
  font-size: 4em;
}}
.textInputWrap {{
  animation: keyframe-transform-vertically-swinging 1s linear infinite;
}}
.textInputButton {{
  animation: keyframe-transform-bigger-smaller-bounce 1s linear infinite;
  background-color: #ff728a;
}}
.emojiWrap {{
  background-color: rgba(255, 255, 255, 0.05);
}}
.emoji {{
  animation: keyframe-transform-rotate-clockwise 5s linear infinite;
}}
.emojiCount {{
  animation: keyframe-opacity-blinking 2s linear infinite;
}}
main {{
  opacity: 0.9;
  background-color: #1c1c25;
}}
body {{
  background-color: #1c1c25;
}}
\`\`\`
`;
const exampleGamings = `
Input text:
Human: 背景をゲーミングPCっぽく虹色に光らせて
Output:
\`\`\`
@keyframes gaming-rainbow-background {{
  0% {{ background-position: 0% 50%; }}
  50% {{ background-position: 100% 50%; }}
  100% {{ background-position: 0% 50%; }}
}}
body {{
  background: linear-gradient(to right, red, orange, yellow, green, aqua, blue, purple);
  background-size: 600% 600%;
  animation: gaming-rainbow-background 2s ease infinite;
}}
\`\`\`

Input text:
Human: チャット欄をゲーミングPCっぽく虹色に光らせて
Output:
\`\`\`
@keyframes gaming-rainbow-background {{
  0% {{ background-position: 0% 50%; }}
  50% {{ background-position: 100% 50%; }}
  100% {{ background-position: 0% 50%; }}
}}
.dialogueElementItem {{
  --gamingBorderWidth: 1px;
  position: relative;
  border: none;
  border-radius: var(--gamingBorderWidth);
}}
.dialogueElementItem:after {{
  content: '';
  position: absolute;
  top: calc(-1 * var(--gamingBorderWidth) * 2);
  left: calc(-1 * var(--gamingBorderWidth) * 2);
  height: calc(100% + var(--gamingBorderWidth) * 4);
  width: calc(100% + var(--gamingBorderWidth) * 4);
  background: linear-gradient(to right, red, orange, yellow, green, aqua, blue, purple);
  border-radius: calc(2 * var(--gamingBorderWidth));
  z-index: -1;
  background-size: 600% 600%;
  animation: gaming-rainbow-background 2s ease infinite;
}}
\`\`\`
`;
const exampleTwitter = `
Input text:
Human: 全体的にTwitterっぽくして
Output:
\`\`\`
.avatarIcon {{
  border-radius: 50%;
}}
.avatarIcon img {{
  border-radius: 50%;
}}
.dialogueElementItem {{
  background-color: #1c2732;
  border-color: #1d9bf0;
}}
.dialogueTextRow {{
  font-size: 1em;
}}
.textInputWrap {{
}}
.textInputButton {{
  background-color: #1d9bf0;
}}
.emojiWrap {{
  background-color: #38444d;
}}
.emojiCount {{
}}
main {{
  opacity: 0.9;
  background-color: #15202b;
  border-color: #38444d;
}}
body {{
  background-color: #15202b;
}}
\`\`\`
`;
const exampleChatGpt = `
Input text:
Human: 全体的にChatGPTっぽくして
Output:
\`\`\`
.avatarIcon {{
  border-radius: 30px;
}}
.dialogueElementItem {{
  border-color: #555659;
}}
.textInputButton {{
  background-color: #ececf1;
}}
.emojiWrap {{
  background-color: #38444d;
}}
main {{
  opacity: 0.9;
  background-color: #343541;
  border-color: #555659;
}}
body {{
  background-color: #2a2b32;
}}
\`\`\`
`;
const domStructures = `
Note that, HTML has following DOM structures:
html > body > main > div.dialogueListWrap > div.dialogueElementItem.dialogueElementItemAssistant > div.avatarIconWrap > div.avatarIcon > img
html > body > main > div.dialogueListWrap > div.dialogueElementItem.dialogueElementItemHuman > div.avatarIconWrap > div.avatarIcon > img
html > body > main > div.dialogueListWrap > div.dialogueElementItem.dialogueElementItemAssistant > div.dialogueElementWrap > div.dialogueTextWrap > div.dialogueTextRow
html > body > main > div.dialogueListWrap > div.dialogueElementItem.dialogueElementItemHuman > div.dialogueElementWrap > div.dialogueTextWrap > div.dialogueTextRow
html > body > main > div.dialogueListWrap > div.dialogueElementItem.dialogueElementItemAssistant > div.dialogueElementWrap > div.dialogueEmojiListWrap > div.emojiWrap > span.emoji > img
html > body > main > div.dialogueListWrap > div.dialogueElementItem.dialogueElementItemHuman > div.dialogueElementWrap > div.dialogueEmojiListWrap > div.emojiWrap > span.emoji > img
html > body > main > div.dialogueListWrap > div.dialogueElementItem.dialogueElementItemAssistant > div.dialogueElementWrap > div.dialogueEmojiListWrap > div.emojiWrap > span.emojiCount
html > body > main > div.dialogueListWrap > div.dialogueElementItem.dialogueElementItemHuman > div.dialogueElementWrap > div.dialogueEmojiListWrap > div.emojiWrap > span.emojiCount
html > body > main > div.textInputWrap > div.textInput > textarea.textInputTextarea
html > body > main > div.textInputWrap > div.textInput > button.textInputButton
`;
export const LUNATIC_CSS_PROMPT = new PromptTemplate({
  template: `You are an expert of CSS. You generate the CSS as accurately as possible according to the conversation history with Human. Note that, assistant is same as AI, Human is same as User, Chat is same as Dialogue or Conversation.

You will always reply according to the following rules:
- You always generate valid CSS based on whole conversation history.
- The CSS MUST be enclosed by three backticks on new lines, denoting that it is a code block.
- If the conversation history does not contain any intent, you output the most complex CSS that randomly specify CSS class name and animation keyframe as an example.

Pre defined css class name is: [${cssClassNames.join(", ")}]

Examples:
===
${exampleHello}${exampleGamings}${exampleTwitter}
===

Conversation history:
{chat_history}

Generated CSS:`,
  inputVariables: ["chat_history"],
});
