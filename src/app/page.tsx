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

const greeting = `対話型自己書き換えウェブサイト。
ルナティック、起動しました。

私には、ユーザーの指示に従って、このウェブサイトの見た目を変更する能力があります。
完全に操作不能に破壊することも可能ですので、ご注意ください。

本ウェブサイトを利用した場合は、以下の事項に同意したものとみなされます。
免責事項：本ウェブサイトの開発運用者は、あなたが本ウェブサイトを利用することによって生ずる、いかなる損害に対しても、一切責任を負いません。

ユーザーの指示を待機しています…`;

const defaultUserCssStyle = `
@keyframes keyframe-opacity-blinking {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes keyframe-transform-rotate-clockwise {
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}
@keyframes keyframe-transform-horizontally-swaying {
  0% { transform: translate(-15px, 0); }
  50% { transform: translate(15px, 0); }
  100% { transform: translate(-15px, 0); }
}
@keyframes keyframe-transform-vertically-swinging {
  0% { transform: translate(0, 0px); }
  50% { transform: translate(0, -30px); }
  100% { transform: translate(0, 0px); }
}
@keyframes keyframe-transform-bigger-smaller {
  0% { transform: scale(0.5); }
  50% { transform: scale(1.2); }
  100% { transform: scale(0.5); }
}
@keyframes keyframe-transform-bigger-smaller-and-rotate-clockwise {
  0% { transform: scale(0.5) rotate(0); }
  50% { transform: scale(1.2) rotate(180deg); }
  100% { transform: scale(0.5) rotate(360deg); }
}
main {
  opacity: 0.9;
  background-color: transparent;
}
.avatarIcon {
  animation: keyframe-transform-bigger-smaller-and-rotate-clockwise 2s linear infinite;
}
.dialogueElementItem {
  background-color: transparent;
  animation: keyframe-transform-horizontally-swaying 5s linear infinite;
}
.textInputWrap {
  animation: keyframe-transform-vertically-swinging 2s linear infinite;
}
.textInputButton {
  animation: keyframe-transform-bigger-smaller 1s linear infinite;
}
.emojiCount {
  animation: keyframe-opacity-blinking 5s linear infinite;
}
`;

export default function Home() {
  const [userCssStyle, setUserCssStyle] = useLocalStorage<string>(
    "lunatic-user-css-style",
    ""
  );

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState(greeting);
  const [requesting, setRequesting] = useState(false);
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
              if (!requesting) {
                setResponding(false);
              }
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
  }, [
    intervalId,
    lazyInserting,
    lazyInsertingInitialized,
    outputText,
    requesting,
  ]);

  const insertNewDialogue = useCallback(
    (newDialogueElement: DialogueElement, lazy?: boolean) => {
      if (!lazy) {
        setDialogueList((prev) => {
          return [...prev, newDialogueElement];
        });
      } else {
        setLazyInserting(true);
        const lazyNewDialogueElement = {
          ...newDialogueElement,
          text: "",
        };
        setDialogueList((prev) => {
          return [...prev, lazyNewDialogueElement];
        });
        setOutputText(newDialogueElement.text);
      }
    },
    []
  );

  const onSubmit = useCallback(async () => {
    setResponding(true);

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

    setRequesting(true);
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

    setRequesting(true);
    const cssRes = await nextPostJson("/api/lunatic/css", {
      currentCss: userCssStyle,
      pastMessagesJsonString: JSON.stringify(surfaceResJson.history),
    });
    const cssResJson = await cssRes.json();
    if (cssResJson.css) {
      const newUserCssStyle = cssResJson.css.split("```")[1];
      console.log(newUserCssStyle);
      setUserCssStyle(newUserCssStyle);
    }
    setResponding(false);
    setRequesting(false);
  }, [
    inputText,
    insertNewDialogue,
    pastMessages,
    setUserCssStyle,
    userCssStyle,
  ]);

  const onClickEmergency = useCallback(() => {
    console.log(defaultUserCssStyle);
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
            margin: "0.5em auto 10em",
          }}
        >
          {dialogueList.map((dialogueElement, dialogueIndex) => {
            return (
              <DialogueElementItem
                key={dialogueIndex}
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
