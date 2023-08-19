import { FunctionComponent, useContext, useEffect, useRef } from "react";
import { BoltIcon } from "@heroicons/react/24/outline";
import { ChatContext, ChatProvider, ChatType } from "./utils";
import { useData } from "datagovmy-ui/hooks";
import ChatBubble from "./bubble";
import ChatInput from "./input";

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
      <ChatInput />

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
        <br />
        All conversations are locally stored in your device. We do not collect conversations between
        you and the AI Helper.
      </p>

      <p className="text-dim text-center text-xs">AI Helper v1.0.0</p>
    </div>
  );
};

export default Chat;
