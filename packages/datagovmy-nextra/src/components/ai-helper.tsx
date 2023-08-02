import {
  FunctionComponent,
  ForwardRefExoticComponent,
  forwardRef,
  useEffect,
  useState,
  ForwardedRef,
  useRef,
} from "react";
import { BoltIcon, XMarkIcon, UserIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import cn from "clsx";
import Button from "./button";
import { Dialog } from "@headlessui/react";
import Markdown from "react-markdown";
import { Textarea } from "./text-area";
import { stream } from "../utils/api";
import { useLocalStorage, useSessionStorage } from "../utils/hooks";

type ChatType = {
  from: "user" | "ai";
  text: string;
};

interface ChatInterface {
  ref?: ForwardedRef<HTMLDivElement>;
  from: "user" | "ai";
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
      <div className="flex items-start gap-2" ref={ref}>
        {
          {
            ai: (
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
            "dark:border-outlineHover-dark whitespace-pre-wrap rounded-lg border p-2.5 text-sm",
            from === "user" ? "bg-washed dark:bg-washed-dark" : "bg-transparent"
          )}
        >
          {
            {
              ai: children.length > 0 ? <Markdown>{children}</Markdown> : <p>{dots}</p>,
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
  const [open, setOpen] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [prompt, setPrompt] = useSessionStorage("prompt");
  const [chats, setChats] = useLocalStorage("chats", []);

  const fetchResponse = async (prompt: string) => {
    scrollToBottom();
    setFetching(true);
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "systemPrompt",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0,
    };

    const { body } = await stream("/chat", payload);
    if (body === null) {
      setFetching(false);
      return;
    }

    const reader = body.pipeThrough(new TextDecoderStream()).getReader();
    let _answer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        setFetching(false);
        setChats((chats: ChatType[]) => chats.concat({ from: "ai", text: _answer }));
        setAnswer("");
        break;
      }
      setAnswer(answer => answer.concat(value));
      _answer += value;
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
    setChats([...chats, { from: "user", text: prompt }]);
    fetchResponse(prompt);
  };

  const clearChats = () => setChats([]);

  return (
    <>
      <Button
        variant="primary"
        className={cn(!open ? "fixed bottom-4 right-4 rounded-full px-3 py-1.5" : "hidden")}
        onClick={() => setOpen(true)}
      >
        <BoltIcon className="h-4 w-4" />
        <p>AI Helper</p>
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <Button
          variant="primary"
          className="fixed bottom-4 right-4 flex aspect-square w-12 justify-center rounded-full"
        >
          <XMarkIcon className="h-8 w-8" />
        </Button>

        <div className="fixed inset-0 pt-[15%] ">
          <div className="block lg:p-4">
            <Dialog.Panel className="shadow-floating dark:border-outlineHover-dark absolute bottom-[72px] right-0 top-0 flex w-full flex-col rounded-xl border bg-white font-sans dark:bg-black lg:right-6 lg:top-6 lg:w-1/4">
              <div className="relative flex h-full w-full flex-col">
                <div className="relative grow overflow-auto px-5" ref={chatRef}>
                  {chats.length > 0 ? (
                    // Chat Bubbles
                    <div className="space-y-3 pb-16 pt-5">
                      {chats.map((chat: ChatType) => (
                        <ChatBubble from={chat.from}>{chat.text}</ChatBubble>
                      ))}
                      {fetching && <ChatBubble from="ai">{answer}</ChatBubble>}
                    </div>
                  ) : (
                    // Chat Bubbles (Empty state)
                    <div className="flex h-full flex-col items-center justify-center space-y-8">
                      <div className="bg-primary-dgm dark:bg-primary-dark shadow-primary-dgm flex aspect-square w-12 items-center justify-center rounded-lg shadow-2xl">
                        <BoltIcon className="h-8 w-8 text-white" />
                      </div>
                      <h3>AI Helper</h3>
                      <p className="text-center">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris
                      </p>
                    </div>
                  )}
                </div>

                {/* Clear chat */}
                {chats.length > 0 && (
                  <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 ">
                    <Button
                      variant="default"
                      className="text-dim rounded-md px-3 py-1.5 text-sm hover:text-black"
                      title="Clear chat"
                      onClick={clearChats}
                    >
                      <TrashIcon className="h-4 w-4" />
                      Clear chat
                    </Button>
                  </div>
                )}

                {/* Prompt */}
                <div className="shadow-floating dark:border-outlineHover-dark mx-5 mb-5 flex items-center gap-2 rounded-lg border bg-white">
                  <Textarea
                    className="max-h-[30vh] min-h-[40px] w-full grow bg-white pr-12 pt-3 text-sm dark:border-transparent lg:text-sm"
                    placeholder="Ask a question related to data.gov.my"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={e => {
                      if (e.key !== "Enter") return;
                      if (e.key === "Enter" && e.shiftKey) return;
                      e.preventDefault();
                      if (e.currentTarget.value.length > 0) {
                        submitPrompt(prompt.trim());
                        setPrompt("");
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    className="absolute right-7 aspect-square w-8 justify-center rounded-md"
                    title="Submit prompt"
                    disabled={!prompt.length || fetching}
                    onClick={e => {
                      if (prompt.length === 0) return;
                      submitPrompt(prompt);
                      setPrompt("");
                    }}
                  >
                    <PaperAirplaneIcon className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AIHelper;
