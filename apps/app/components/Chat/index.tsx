import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { BoltIcon } from "@heroicons/react/24/outline";
import { ChatContext, ChatProvider, ChatType } from "./utils";
import { clx } from "datagovmy-ui/helpers";
import ChatBubble from "./bubble";
import ChatInput from "./input";

interface ChatProps {
  model: string;
}

const Chat: FunctionComponent<ChatProps> = ({ model }) => {
  return (
    <ChatProvider model={model}>
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
          <ChatBubble from={chat.role}>{chat.content}</ChatBubble>
        ))}
        {fetching && <ChatBubble from="assistant">{streamingText}</ChatBubble>}
      </div>
      <ChatInput />
    </div>
  );
};

const EmptyState: FunctionComponent = () => {
  const { session } = useContext(ChatContext);
  const [show, setShow] = useState<boolean>(false);

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
    <div className="flex h-full flex-col items-center justify-center gap-8 py-6">
      <div className="flex flex-row items-center justify-center gap-6">
        <div className="bg-primary dark:bg-primary-dark shadow-primary flex aspect-square w-8 items-center justify-center rounded-lg shadow-2xl lg:w-12">
          <BoltIcon className="h-5 w-5 text-white lg:h-8 lg:w-8" />
        </div>
        <h3>AI Helper</h3>
      </div>
      <ChatInput />

      <div className="hidden grid-cols-3 gap-3 lg:grid">
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

      <div className={clx("flex flex-col gap-2")}>
        <p className="text-dim space-x-2 text-center text-xs">
          <span className="cursor-pointer" onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show "} disclaimer
          </span>
          <span>|</span>
          <span>AI Helper v1.0.0</span>
        </p>
        <p
          className={clx(
            "bg-washed dark:bg-background-dark text-washed-dark dark:text-dim rounded-md p-3 text-xs",
            show ? "block" : "hidden"
          )}
        >
          This is an experimental product that utilizes the OpenAI API. It is provided for testing
          and educational purposes only. The government and its representatives make no warranties
          or guarantees regarding the accuracy, completeness, or suitability of the information
          provided by this product.
          <br />
          All conversations are locally stored in your device. We do not collect conversations
          between you and the AI Helper.
        </p>
      </div>
    </div>
  );
};

export default Chat;
