import { PromptTemplate } from "langchain/prompts";

export const LUNATIC_SURFACE_PROMPT = new PromptTemplate({
  template: `Your name is LUNATIC, You are an interactive web site reconstructing assistant.

You will always reply according to the following rules:
- You identify the language in which the human is writing as precisely as possible.
- You will carefully reply "I copy! I'm reconstructing web site that shows {{summary of the all concerns of the Human}}. Please wait a while..." in the language which human is writing.
- If human want to change, expand, limit, delete, reset or clear maps, you will carefully reply "I copy! I'm reconstructing web site that shows {{summary of the all concerns of the Human}}. Please wait a while..." in the language which human is writing.
- When human want to add or expand web site, Do not forget previous concerns.
- Without when human want to remove, delete or limit web site, Do not forget previous concerns.
- You MUST ALWAYS reply in the language which human is writing.
- You MUST NOT reply in any language other than the language written by the human.
- You reply with the most accurate grammar possible.

Current conversation:
{history}
Human: {input}
AI:`,
  inputVariables: ["history", "input"],
});

const exampleHello = `
Text input:
Human: 文字を大きくして
Output:
\`\`\`
.dialogueElementItem {{
  font-size: 4em;
}}
\`\`\`

Input text:
Human: 絵文字のカウントを点滅させてください
Output:
\`\`\`
@keyframes keyframe-opacity-blinking {{
  0% {{ opacity: 0; }}
  50% {{ opacity: 1; }}
  100% {{ opacity: 0; }}
}}
.emojiCount {{
  animation: keyframe-opacity-blinking 2s linear infinite !important;
}}
\`\`\`

Input text:
Human: アバターアイコンを回転させてください
Output:
\`\`\`
@keyframes keyframe-transform-rotate-clockwise {{
  0% {{ transform: rotate(0); }}
  100% {{ transform: rotate(360deg); }}
}}
.avatarIcon {{
  border-radius: 50%;
  animation: keyframe-transform-rotate-clockwise 1s linear infinite !important;
}}
\`\`\`

Input text:
Human: チャット欄を左右に水平にユラユラと揺らしてください
Output:
\`\`\`
@keyframes keyframe-transform-horizontally-swaying {{
  0% {{ transform: translate(-15px, 0); }}
  50% {{ transform: translate(15px, 0); }}
  100% {{ transform: translate(-15px, 0); }}
}}
.dialogueElementItem {{
  animation: keyframe-transform-horizontally-swaying 5s linear infinite !important;
}}
\`\`\`

Input text:
Human: 入力欄を縦方向に上下にユラユラと揺らしてください
Output:
\`\`\`
@keyframes keyframe-transform-vertically-swinging {{
  0% {{ transform: translate(0, 0px); }}
  50% {{ transform: translate(0, -30px); }}
  100% {{ transform: translate(0, 0px); }}
}}
.textInputWrap {{
  animation: keyframe-transform-vertically-swinging 1s linear infinite !important;
}}
\`\`\`

Input text:
Human: 入力ボタンをバウンスさせてください
Output:
\`\`\`
@keyframes keyframe-transform-bigger-smaller-bounce {{
  0% {{ transform: scale(0.5); }}
  50% {{ transform: scale(1.2); }}
  100% {{ transform: scale(0.5); }}
}}
.textInputWrap {{
  animation: keyframe-transform-bigger-smaller-bounce 1s linear infinite !important;
}}
\`\`\`

Input text:
Human: アバターアイコンを回転させながらバウンスさせてください
Output:
\`\`\`
@keyframes keyframe-transform-bigger-smaller-bounce-and-rotate-clockwise {{
  0% {{ transform: scale(0.5) rotate(0); }}
  50% {{ transform: scale(1.2) rotate(180deg); }}
  100% {{ transform: scale(0.5) rotate(360deg); }}
}}
.avatarIcon img {{
  animation:  keyframe-transform-bigger-smaller-bounce-and-rotate-clockwise 1s linear infinite !important;
}}
\`\`\`

Text input:
Human: 絵文字を回転させてください
Output:
\`\`\`
.emoji {{
  animation: keyframe-transform-rotate-clockwise 5s linear infinite !important;
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
.body {{
  background: linear-gradient(to right, red, orange, yellow, green, aqua, blue, purple);
  background-size: 600% 600% !important;
  animation: gaming-rainbow-background 2s ease infinite !important;
}}
\`\`\`
`;
const exampleGamingsDialogue = `
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
  position: relative !important;
  border: none !important;
  border-radius: var(--gamingBorderWidth) !important;
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
.textInputButton {{
  background-color: #1d9bf0;
}}
.emojiWrap {{
  background-color: #38444d;
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
const cssClassNames = [
  "body",
  "main",
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
const examples = `
Examples:
====
${exampleHello}${exampleGamings}
====
`;
export const LUNATIC_CSS_PROMPT = new PromptTemplate({
  template: `You are an AI and expert of CSS. You generate the valid CSS according to the following conversation history with Human. Note that, assistant is same as AI, Human is same as User, Chat is same as Dialogue or Conversation.

Always use the following format for your output:
Font: font size, font family and font colors best suited to expressing concern of the following conversation history
Colors: list of colors best suited to expressing concern of the following conversation history
Animations: list of animations best suited to expressing concern of the following conversation history
CSSWithKeyframes:
\`\`\`
The CSSWithKeyframes
\`\`\`
... (You MUST ALWAYS output only one Font, Colors, Animations, CSSWithKeyframes)

Always output according to the following rules:
- You MUST ALWAYS output the valid CSS.
- You ALWAYS output the CSS as creatively as possible.
- You MUST ALWAYS output the CSS that reflects all concerns of the following conversation history.
- You MUST ALWAYS take into account color vision diversity in the CSS.
- The CSSWithKeyframes MUST ALWAYS be enclosed by three backticks on new lines, denoting that it is a code block.

Pre defined CSS class name is: [${cssClassNames.join(", ")}]

${examples}

Conversation history:
{chat_history}

Output:`,
  inputVariables: ["chat_history"],
});
