import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { BoltIcon } from "@heroicons/react/24/outline";
import { ChatContext, ChatProvider, ChatType } from "./utils";
import { clx } from "datagovmy-ui/helpers";
import ChatBubble from "./bubble";
import ChatInput from "./input";
import { useTranslation } from "datagovmy-ui/hooks";

interface ChatProps {
  model: string;
  chain: "main" | "docs";
}

const Chat: FunctionComponent<ChatProps> = ({ model, chain }) => {
  return (
    <ChatProvider model={model} chain={chain}>
      <div className="mx-auto h-[90vh] w-full max-w-screen-md">
        <ActiveState />
        <EmptyState />
      </div>
    </ChatProvider>
  );
};

const ActiveState: FunctionComponent = () => {
  const { session, fetching, streamingText } = useContext(ChatContext);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [streamingText]);

  const scrollToBottom = () => {
    const element = chatRef.current;
    if (element && element !== null) element.scrollTop = element.scrollHeight;
  };

  if (!session || session.chats.length <= 0) return;
  return (
    <div className="relative flex h-full max-h-[90vh] w-full grow flex-col justify-between pb-6 dark:bg-black">
      <div className="relative h-full space-y-3 overflow-auto pb-16 pr-3 pt-6" ref={chatRef}>
        {session.chats.map((chat: ChatType) => (
          <ChatBubble key={chat.content} from={chat.role}>
            {chat.content}
          </ChatBubble>
        ))}
        {fetching && <ChatBubble from="assistant">{streamingText}</ChatBubble>}
      </div>
      <ChatInput />
    </div>
  );
};

const EmptyState: FunctionComponent = () => {
  const { session } = useContext(ChatContext);
  const { t } = useTranslation(["datagpt", "common"]);
  const [show, setShow] = useState<boolean>(false);

  const features = {
    examples: [t("examples", { context: 1 }), t("examples", { context: 2 })],
    capabilities: [t("capabilities", { context: 1 }), t("capabilities", { context: 2 })],
    limitations: [t("limitations", { context: 1 }), t("limitations", { context: 2 })],
  };

  if (session && session?.chats.length > 0) return;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 py-6">
      <div className="flex flex-row items-center justify-center gap-6">
        <div className="bg-primary dark:bg-primary-dark shadow-primary flex aspect-square w-8 items-center justify-center rounded-lg shadow-2xl lg:w-12">
          <BoltIcon className="h-5 w-5 text-white lg:h-8 lg:w-8" />
        </div>
        <h3>DataGPT</h3>
      </div>
      <ChatInput />

      <div className="hidden grid-cols-3 gap-3 lg:grid">
        {Object.entries(features).map(([category, descriptions]) => {
          return (
            <div key={category} className="flex flex-col items-center gap-3">
              <p className="font-medium">{t(category)}</p>
              <ul className="flex flex-col gap-3 text-sm">
                {descriptions.map(description => {
                  return (
                    <li
                      key={description}
                      className="bg-washed dark:bg-background-dark text-washed-dark dark:text-dim rounded-md p-3"
                    >
                      {description}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className={clx("flex flex-col gap-2")}>
        <p className="text-dim space-x-2 text-center text-xs">
          <span className="cursor-pointer" onClick={() => setShow(!show)}>
            {show ? t("disclaimer_hide") : t("disclaimer_show")}
          </span>
          <span>|</span>
          <span>DataGPT v1.0.0</span>
        </p>
        <p
          className={clx(
            "bg-washed dark:bg-background-dark text-washed-dark dark:text-dim rounded-md p-3 text-xs",
            show ? "block" : "hidden"
          )}
        >
          {t("disclaimer", { context: 1 })}
          <br />
          {t("disclaimer", { context: 2 })}
        </p>
      </div>
    </div>
  );
};

export default Chat;
