"use client";

import { DialogueElementItem } from "@/components/DialogueElementItem";
import { TextInput } from "@/components/TextInput";
import { emojiDict } from "@/const/emojiDict";
import { useLocalStorage } from "@/hooks/localStorage";
import { DialogueElement } from "@/types/DialogueElement";
import { nextPostJson } from "@/utils/nextPostJson";
import { scrollToBottom } from "@/utils/scrollToBottom";
import { sleep } from "@/utils/sleep";
import { useCallback, useEffect, useState } from "react";

const greeting = `対話型自己変更ウェブサイト。
ルナティック、起動しました。

私には、ユーザーの指示に従って、このウェブサイトの見た目を変更する能力があります。
完全に操作不能に破壊することも可能ですので、ご注意ください。

本サイトを利用した場合は、以下の事項に同意したものとみなされます。
免責事項：本サイトの開発運用者は、あなたが本サイトを利用することによって生ずる、いかなる損害に対しても、一切責任を負いません。

ユーザーの指示を待機しています…`;

const defaultUserCssStyle = `
main {
  opacity: 0.9;
  background-color: transparent;
}
.avatarIcon {
  animation:0.5s linear infinite keyframe-clockwise-rotate;
}
.dialogueElementItem {
  animation:5s linear infinite keyframe-horizontally-swaying;
}
.textInputWrap {
  animation:2s linear infinite keyframe-vertically-swinging;
}
.textInputButton {
  animation:1s linear infinite keyframe-bigger-smaller;
}
`;

export default function Home() {
  const [userCssStyle, setUserCssStyle] = useLocalStorage<string>(
    "lunatic-user-css-style",
    ""
  );

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState(greeting);
  const [responding, setResponding] = useState(false);

  const [dialogueList, setDialogueList] = useState<DialogueElement[]>([]);
  const [pastMessages, setPastMessages] = useState<
    { messages: Array<any> } | undefined
  >();

  const [lazyInserting, setLazyInserting] = useState(false);
  const [lazyInsertingInitialized, setLazyInsertingInitialized] =
    useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();

  useEffect(() => {
    if (lazyInserting) {
      if (!lazyInsertingInitialized) {
        const newIntervalId = setInterval(() => {
          setDialogueList((prev) => {
            const last = prev[prev.length - 1];
            last.text = outputText.slice(0, last.text.length + 1);
            scrollToBottom();
            if (outputText.length === last.text.length) {
              setLazyInserting(false);
              setLazyInsertingInitialized(false);
              setOutputText("");
            }
            return [...prev.slice(0, prev.length - 1), last];
          });
        }, 50);
        setIntervalId(newIntervalId);
        setLazyInsertingInitialized(true);
      }
    } else {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }
    return () => {
      if (!lazyInserting) {
        clearInterval(intervalId);
        setIntervalId(undefined);
      }
    };
  }, [intervalId, lazyInserting, lazyInsertingInitialized, outputText]);

  const insertNewDialogue = useCallback(
    (newDialogueElement: DialogueElement, lazy?: boolean) => {
      if (!lazy) {
        setDialogueList((prev) => {
          return [...prev, newDialogueElement];
        });
      } else {
        const lazyNewDialogueElement = {
          ...newDialogueElement,
          text: "",
        };
        setDialogueList((prev) => {
          return [...prev, lazyNewDialogueElement];
        });
        setOutputText(newDialogueElement.text);
        setLazyInserting(true);
      }
    },
    []
  );

  const onSubmit = useCallback(async () => {
    const newInputText = inputText.trim();
    setInputText("");
    console.log(newInputText);
    insertNewDialogue({
      who: "user",
      text: newInputText,
      emojiList: Object.keys(emojiDict)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map((emojiName) => {
          return {
            name: emojiName,
            count: Math.floor(Math.random() * (1000 - 0 + 1) + 0),
          };
        }),
    });
    await sleep(200);
    scrollToBottom();
    setResponding(true);

    const surfaceRes = await nextPostJson("/api/lunatic/surface", {
      query: newInputText,
      pastMessagesJsonString: pastMessages
        ? JSON.stringify(pastMessages)
        : undefined,
    });

    const surfaceResJson: {
      surface: string;
      history: { messages: Array<any> };
    } = await surfaceRes.json();
    setPastMessages(surfaceResJson.history);
    insertNewDialogue(
      {
        who: "assistant",
        text: surfaceResJson.surface,
        emojiList: Object.keys(emojiDict)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4)
          .map((emojiName) => {
            return {
              name: emojiName,
              count: Math.floor(Math.random() * (1000 - 0 + 1) + 0),
            };
          }),
      },
      true
    );
    setResponding(true);
    const cssRes = await nextPostJson("/api/lunatic/css", {
      currentCss: userCssStyle,
      pastMessagesJsonString: JSON.stringify(surfaceResJson.history),
    });
    const cssResJson = await cssRes.json();
    setResponding(false);
    if (cssResJson.css) {
      const newUserCssStyle = cssResJson.css.split("```")[1];
      console.log(newUserCssStyle);
      setUserCssStyle(newUserCssStyle);
    }

    setResponding(false);
  }, [
    inputText,
    insertNewDialogue,
    pastMessages,
    setUserCssStyle,
    userCssStyle,
  ]);

  const onClickEmergency = useCallback(() => {
    setUserCssStyle(defaultUserCssStyle);
  }, [setUserCssStyle]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      const emojiNames = Object.keys(emojiDict)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      insertNewDialogue(
        {
          who: "assistant",
          text: greeting,
          emojiList: emojiNames.map((emojiName) => {
            return {
              name: emojiName,
              count: Math.floor(Math.random() * (1000 - 0 + 1) + 0),
            };
          }),
        },
        true
      );
      if (!userCssStyle || userCssStyle.length === 0) {
        setUserCssStyle(defaultUserCssStyle);
      }
    }
  }, [mounted, userCssStyle, setUserCssStyle, insertNewDialogue]);
  if (!mounted) return null;

  return (
    <>
      <main suppressHydrationWarning>
        <div
          className="dialogueListWrap"
          style={{
            width: "98%",
            margin: "0.5em auto 5em",
          }}
        >
          {dialogueList.map((dialogueElement, dialogueIndex) => {
            return (
              <DialogueElementItem
                key={dialogueIndex}
                prevDialogueElement={
                  0 < dialogueIndex
                    ? dialogueList[dialogueIndex - 1]
                    : undefined
                }
                dialogueElement={dialogueElement}
                dialogueIndex={dialogueIndex}
                isResponding={
                  (responding || lazyInserting) &&
                  dialogueIndex === dialogueList.length - 1
                }
              />
            );
          })}
        </div>
        <div
          className="textInputWrap"
          style={{
            position: "absolute",
            bottom: "1em",
            left: 0,
            width: "98%",
            margin: "auto",
          }}
        >
          <TextInput
            disabled={responding || lazyInserting}
            placeholder={"全体の背景を青色にして"}
            inputText={inputText}
            setInputText={setInputText}
            onSubmit={onSubmit}
          />
        </div>
      </main>
      <div className="emergencyButtonWrap">
        <button onClick={onClickEmergency}>緊急脱出</button>
      </div>
      <style suppressHydrationWarning>{userCssStyle}</style>
    </>
  );
}
