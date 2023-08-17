import { Button, Textarea } from "datagovmy-ui/components";
import { FunctionComponent, useContext, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { BoltIcon } from "@heroicons/react/24/outline";
import { ChatContext, ChatProvider, ChatType } from "./utils";
import { useData } from "datagovmy-ui/hooks";
import ChatBubble from "./bubble";
import { FiletreeContext } from "@components/Filetree/utils";

interface ChatProps {
  model: string;
}

const Chat: FunctionComponent<ChatProps> = ({ model }) => {
  return (
    <ChatProvider model={model}>
      <div className="mx-auto w-full max-w-screen-md">
        <ActiveState />
        <EmptyState />
      </div>
    </ChatProvider>
  );
};

const ActiveState: FunctionComponent = () => {
  const { prompt, session, setPrompt } = useContext(ChatContext);
  const chatRef = useRef<HTMLDivElement>(null);
  const { data, setData } = useData({
    fetching: false,
    answer: "",
  });

  useEffect(() => {
    scrollToBottom();
  }, [data.answer]);

  const scrollToBottom = () => {
    const element = chatRef.current;
    if (element && element !== null) element.scrollTop = element.scrollHeight;
  };

  if (!session || session.chats.length <= 0) return;
  return (
    <div>
      <div className="relative flex h-full w-full grow flex-col overflow-hidden rounded-xl bg-white shadow-lg dark:bg-black">
        <div className="relative grow overflow-auto px-5" ref={chatRef}>
          {session.chats.length > 0 ? (
            // Chat Bubbles
            <div className="space-y-3 pb-16 pt-5">
              {session.chats.map((chat: ChatType) => (
                <ChatBubble from={chat.from}>{chat.text}</ChatBubble>
              ))}
              {data.fetching && <ChatBubble from="ai">{data.answer}</ChatBubble>}
            </div>
          ) : (
            // Chat Bubbles (Empty state)
            <div className="flex h-full flex-col items-center justify-center space-y-8">
              <div className="bg-primary-dgm dark:bg-primary-dark shadow-primary-dgm flex aspect-square w-12 items-center justify-center rounded-lg shadow-2xl">
                <BoltIcon className="h-8 w-8 text-white" />
              </div>
              {/* <h3>{t("ai.header")}</h3>
                        <p className="text-center">{t("ai.description")}</p>
                        <div className="bg-washed inline space-x-1 rounded p-2 text-xs">
                          <p className="inline grow">{t("ai.disclaimer")}</p>
                        </div> */}
            </div>
          )}
        </div>

        {/* Disclaimer (empty state)
                  {session.chats.length > 0 && (
                    <div className="absolute bottom-[80px] left-5 ">
                      <Tooltip
                        trigger={() => (
                          <InformationCircleIcon className="text-dim h-5 w-5 text-sm hover:text-black" />
                        )}
                        anchor="top-left"
                      >
                        <p className="z-50 max-w-[200px] text-xs xl:max-w-[300px]">
                          {t("ai.disclaimer")}
                        </p>
                      </Tooltip>
                    </div>
                  )} */}

        {/* Prompt */}
        {/* <div className="shadow-floating dark:border-outlineHover-dark mx-5 mb-5 flex items-center gap-2 rounded-lg border bg-white">
                    <Textarea
                      className="max-h-[30vh] min-h-[40px] w-full grow bg-white pr-12 pt-3 text-sm dark:border-transparent lg:text-sm"
                      placeholder={t("ai.ask-question")}
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      onKeyDown={e => {
                        if (e.key !== "Enter") return;
                        if (e.key === "Enter" && e.shiftKey) return;
                        e.preventDefault();
                        if (e.currentTarget.value.length > 0 && !data.fetching) {
                          submitPrompt(prompt.trim());
                          setPrompt("");
                        }
                      }}
                    />
                    <Button
                      variant="primary"
                      className="absolute right-7 aspect-square w-8 justify-center rounded-md"
                      title={t("ai.submit-prompt")}
                      disabled={!prompt.length || fetching}
                      onClick={e => {
                        if (prompt.length === 0 || fetching) return;
                        submitPrompt(prompt);
                        setPrompt("");
                      }}
                    >
                      <PaperAirplaneIcon className="h-4 w-4 text-white" />
                    </Button>
                  </div> */}
      </div>
    </div>
  );
};

const EmptyState: FunctionComponent = () => {
  const { active } = useContext(FiletreeContext);
  const { prompt, setPrompt, submitPrompt, session } = useContext(ChatContext);

  const features = {
    examples: [
      `"Generate me a chart of population in Selangor state"`,
      `"Generate a time series chart for seats win by Pakatan Harapan over the general election since 1957"`,
    ],
    capabilities: [
      "Generate charts based on library in Data Catalogue",
      "ventore veritatis et quasi architecto beatae vitae dicta",
    ],
    limitations: [
      "sit amet, consectetur, adipisci velit, sed quia non numquam eius",
      "Your imagination or the sky",
    ],
  };

  if (session && session?.chats.length > 0) return;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="flex flex-row items-center justify-center gap-6">
        <div className="bg-primary dark:bg-primary-dark shadow-primary flex aspect-square w-12 items-center justify-center rounded-lg shadow-2xl">
          <BoltIcon className="h-8 w-8 text-white" />
        </div>
        <h3>AI Helper</h3>
      </div>
      <div className="shadow-floating dark:border-outlineHover-dark relative mx-5 flex w-full items-center gap-2 rounded-lg border bg-white">
        <Textarea
          className="max-h-[30vh] w-full bg-white py-3 text-sm dark:border-transparent lg:text-base"
          placeholder={"Ask a question"}
          rows={1}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => {
            if (e.key !== "Enter") return;
            if (e.key === "Enter" && e.shiftKey) return;
            e.preventDefault();
            // if (e.currentTarget.value.length > 0 && !fetching) {
            submitPrompt(prompt.trim());
            setPrompt("");
            // }
          }}
        />
        <Button
          variant="primary"
          className="absolute right-3 aspect-square w-8 justify-center rounded-md"
          //   title={t("ai.submit-prompt")}
          //   disabled={!prompt.length || fetching}
          onClick={e => {
            // if (prompt.length === 0 || fetching) return;
            // submitPrompt(prompt);
            setPrompt("");
          }}
        >
          <PaperAirplaneIcon className="h-4 w-4 text-white" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(features).map(([category, descriptions]) => {
          return (
            <div className="flex flex-col items-center gap-3">
              <p className="font-medium">{category}</p>
              <ul className="flex flex-col gap-3 text-sm">
                {descriptions.map(description => {
                  return (
                    <li className="bg-washed dark:bg-background-dark text-washed-dark dark:text-dim rounded-md p-3">
                      {description}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="bg-washed dark:bg-background-dark text-washed-dark dark:text-dim rounded-md p-3 text-xs">
        This is an experimental product that utilizes the OpenAI API. It is provided for testing and
        educational purposes only. The government and its representatives make no warranties or
        guarantees regarding the accuracy, completeness, or suitability of the information provided
        by this product.
      </p>

      <p className="text-center text-xs">AI Helper v1.0.0</p>
    </div>
  );
};

export default Chat;
