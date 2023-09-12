import {
  FunctionComponent,
  ForwardRefExoticComponent,
  forwardRef,
  useEffect,
  useState,
  ForwardedRef,
  useRef,
  Fragment,
} from "react";
import {
  BoltIcon,
  XMarkIcon,
  UserIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

import cn from "clsx";
import Button from "./button";
import { Popover, Transition } from "@headlessui/react";
import Markdown from "react-markdown";
import { Textarea } from "./text-area";
import { stream } from "../utils/api";
import { useTranslation, useLocalStorage, useSessionStorage } from "../utils/hooks";
import Tooltip from "./tooltip";

export type ChatType = {
  role: "assistant" | "user";
  content: string;
};

interface ChatInterface {
  ref?: ForwardedRef<HTMLDivElement>;
  from: "user" | "assistant";
  children: string;
}

const ChatBubble: ForwardRefExoticComponent<ChatInterface> = forwardRef(
  ({ from = "user", children }, ref) => {
    const [dots, setDot] = useState(".");
    useEffect(() => {
      let _dots = ".";
      const loop = setInterval(() => {
        _dots += ".";
        if (_dots.length > 3) _dots = ".";
        setDot(_dots);
      }, 300);

      return () => {
        clearInterval(loop);
      };
    }, []);
    return (
      <div className="ai flex items-start gap-2" ref={ref}>
        {
          {
            assistant: (
              <div className="bg-primary-dgm dark:bg-primary-dark flex aspect-square min-w-[32px] items-center justify-center rounded-lg">
                <BoltIcon className="h-5 w-5 text-white" />
              </div>
            ),
            user: (
              <div className="dark:border-outlineHover-dark flex aspect-square min-w-[32px] items-center justify-center rounded-lg border bg-white dark:bg-black">
                <UserIcon className="h-5 w-5 text-black dark:text-white" />
              </div>
            ),
          }[from]
        }
        <div
          className={cn(
            "dark:border-outlineHover-dark space-y-6 rounded-lg border p-2.5 text-sm",
            from === "user" ? "bg-washed dark:bg-washed-dark" : "bg-transparent"
          )}
        >
          {
            {
              assistant: children.length > 0 ? <Markdown>{children}</Markdown> : <p>{dots}</p>,
              user: <p>{children} </p>,
            }[from]
          }
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = "ChatBubble";

interface AIHelperProps {}

const AIHelper: FunctionComponent<AIHelperProps> = () => {
  const chatRef = useRef<HTMLDivElement>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [prompt, setPrompt] = useSessionStorage("prompt");
  const [chats, setChats] = useLocalStorage<ChatType[]>("chats", []);
  const { t } = useTranslation();

  const fetchResponse = async (prompt: string) => {
    scrollToBottom();
    setFetching(true);
    const payload = {
      model: "gpt-3.5-turbo",
      chain_type: "docs",
      messages: chats
        ?.filter(chat => chat.content !== t("ai.error"))
        .slice(-5)
        .concat([{ role: "user", content: prompt }]) || [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0,
    };

    try {
      const { body } = await stream("/chat", payload);
      if (body === null) {
        setFetching(false);
        throw new Error(t("ai.error"));
      }

      const reader = body.pipeThrough(new TextDecoderStream()).getReader();
      let _answer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setFetching(false);
          setChats((chats: ChatType[]) => chats.concat({ role: "assistant", content: _answer }));
          setAnswer("");
          break;
        }
        setAnswer(answer => answer.concat(value));
        _answer += value;
      }
    } catch (error: any) {
      setChats((chats: ChatType[]) => chats.concat({ role: "assistant", content: t("ai.error") }));
      console.error(error.message);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [answer]);

  const scrollToBottom = () => {
    const element = chatRef.current;
    if (element && element !== null) element.scrollTop = element.scrollHeight;
  };

  const submitPrompt = (prompt: string) => {
    setChats([...chats, { role: "user", content: prompt }]);
    fetchResponse(prompt);
  };

  const clearChats = () => setChats([]);

  return (
    <>
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button
              className={cn(
                "from-primary-dgm to-primary-dark shadow-button fixed bottom-4 right-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-t px-3 py-1.5 font-medium text-white transition-all hover:to-[#5B8EFF]",
                open && "flex aspect-square w-12 "
              )}
            >
              {!open ? (
                <>
                  <BoltIcon className="h-4 w-4" />
                  <p>{t("ai.header")}</p>
                </>
              ) : (
                <XMarkIcon className="h-8 w-8" />
              )}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="shadow-floating dark:border-outlineHover-dark fixed bottom-[72px] right-0 top-0 z-50 flex w-full flex-col rounded-xl border bg-white font-sans dark:bg-black lg:right-6 lg:top-6 lg:max-w-[400px] xl:max-w-[25%]">
                <div className="relative flex h-full w-full grow flex-col overflow-hidden rounded-xl bg-white shadow-lg dark:bg-black">
                  <div className="relative grow overflow-auto px-5" ref={chatRef}>
                    {chats.length > 0 ? (
                      // Chat Bubbles
                      <div className="space-y-3 pb-16 pt-5">
                        {chats.map((chat: ChatType) => (
                          <ChatBubble from={chat.role}>{chat.content}</ChatBubble>
                        ))}
                        {fetching && <ChatBubble from="assistant">{answer}</ChatBubble>}
                      </div>
                    ) : (
                      // Chat Bubbles (Empty state)
                      <div className="flex h-full flex-col items-center justify-center space-y-8">
                        <div className="bg-primary-dgm dark:bg-primary-dark shadow-primary-dgm flex aspect-square w-12 items-center justify-center rounded-lg shadow-2xl">
                          <BoltIcon className="h-8 w-8 text-white" />
                        </div>
                        <h3>{t("ai.header")}</h3>
                        <p className="text-center">{t("ai.description")}</p>
                        <div className="bg-washed dark:bg-washed-dark inline space-x-1 rounded p-2 text-xs">
                          <p className="inline grow">{t("ai.disclaimer")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Clear chat */}
                  {chats.length > 0 && (
                    <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 ">
                      <Button
                        variant="default"
                        className="text-dim rounded-md px-3 py-1.5 text-sm shadow-lg hover:text-black"
                        title="Clear chat"
                        onClick={clearChats}
                      >
                        <TrashIcon className="h-4 w-4" />
                        {t("ai.clear-chat")}
                      </Button>
                    </div>
                  )}

                  {/* Disclaimer (empty state) */}
                  {chats.length > 0 && (
                    <div className="absolute bottom-[80px] left-5 ">
                      <Tooltip
                        trigger={() => (
                          <InformationCircleIcon className="text-dim h-5 w-5 text-sm transition hover:text-black dark:hover:text-white" />
                        )}
                        anchor="top-left"
                      >
                        <p className="z-50 max-w-[200px] text-xs xl:max-w-[300px]">
                          {t("ai.disclaimer")}
                        </p>
                      </Tooltip>
                    </div>
                  )}

                  {/* Prompt */}
                  <div className="shadow-floating dark:border-outlineHover-dark  mx-5 mb-5 flex items-center gap-2 rounded-lg border bg-white dark:bg-black">
                    <Textarea
                      className="max-h-[30vh] min-h-[40px] w-full grow bg-white pr-12 pt-3 text-sm lg:text-sm"
                      placeholder={t("ai.ask-question")}
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      onKeyDown={e => {
                        if (e.key !== "Enter") return;
                        if (e.key === "Enter" && e.shiftKey) return;
                        e.preventDefault();
                        if (e.currentTarget.value.length > 0 && !fetching) {
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
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default AIHelper;
