"use client";

import { DialogueElementItem } from "@/components/DialogueElementItem";
import { TextInput } from "@/components/TextInput";
import { useLocalStorage } from "@/hooks/localStorage";
import { DialogueElement } from "@/types/DialogueElement";
import { nextPostJson } from "@/utils/nextPostJson";
import { CSSProperties, useCallback, useEffect, useState } from "react";

const greeting = `対話型自己変更ウェブサイト。
ルナティック、起動しました。

私には、ユーザーの指示に従って、このウェブサイトの見た目を変更する能力があります。
完全に操作不能に破壊することも可能ですので、ご注意ください。

ユーザーの指示を待機しています…`;

export default function Home() {
  const [userCssProps, setUserCssProps] = useLocalStorage<CSSProperties>(
    "lunatic-user-css-props",
    {}
  );
  const [userCssStyle, setUserCssStyle] = useLocalStorage<string>(
    "lunatic-user-css-style",
    ""
  );

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState(greeting);
  const [dialogueList, setDialogueList] = useState<DialogueElement[]>([
    {
      who: "assistant",
      text: "",
    },
  ]);
  const [pastMessages, setPastMessages] = useState<
    { messages: Array<any> } | undefined
  >();

  const [initialized, setInitialized] = useState(false);
  const [lazyInserting, setLazyInserting] = useState(false);
  const [responding, setResponding] = useState(false);

  const [lazyInsertingInitialized, setLazyInsertingInitialized] =
    useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();

  const initializer = useCallback(() => {
    if (initialized) {
      return;
    }
    setResponding(true);
    const outputtingTextLength =
      dialogueList[dialogueList.length - 1].text.length;
    if (outputtingTextLength < outputText.length) {
      const newDialogueList = [
        {
          who: "assistant",
          text: outputText.slice(0, outputtingTextLength + 1),
        },
      ];
      setDialogueList(newDialogueList);
    } else {
      setOutputText("");
      setResponding(false);
      setInitialized(true);
    }
  }, [dialogueList, initialized, outputText]);

  useEffect(() => {
    setTimeout(initializer, 50);
  }, [initializer]);

  useEffect(() => {
    if (lazyInserting) {
      if (!lazyInsertingInitialized) {
        const newIntervalId = setInterval(() => {
          setDialogueList((prev) => {
            const last = prev[prev.length - 1];
            last.text = outputText.slice(0, last.text.length + 1);
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
    insertNewDialogue({ who: "user", text: newInputText });

    setResponding(true);

    const surfaceRes = await nextPostJson("/api/lunatic/surface", {
      query: newInputText,
      pastMessages: pastMessages ? JSON.stringify(pastMessages) : undefined,
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
      },
      true
    );

    setResponding(false);
  }, [inputText, insertNewDialogue, pastMessages]);

  useEffect(() => {
    setUserCssStyle(`
main {
  opacity: 0.9;
  background-color: transparent;
}

.avatarIcon {
  animation:0.5s linear infinite kurukuru;
}

.dialogueElementItem {
  animation:5s linear infinite yurayura;
}

.textInputWrap {
  animation:2s linear infinite huwahuwa-bottom;
}

.textInputButton {
  animation:1s linear infinite byoiin;
}
    `);
  }, [setUserCssStyle]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      <main suppressHydrationWarning>
        <div className="header">
          <h1>LUNATIC v0.0.1</h1>
        </div>
        <div
          className="dialogueListWrap"
          style={{
            position: "absolute",
            top: "1em",
            width: "98%",
            margin: "0.5em auto 10em",
          }}
        >
          {dialogueList.map((dialogueElement, dialogueIndex) => {
            return (
              <div key={dialogueIndex}>
                <DialogueElementItem
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
              </div>
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
            placeholder={"..."}
            inputText={inputText}
            setInputText={setInputText}
            onSubmit={onSubmit}
          />
        </div>
      </main>
      <style suppressHydrationWarning>{userCssStyle}</style>
    </>
  );
}
