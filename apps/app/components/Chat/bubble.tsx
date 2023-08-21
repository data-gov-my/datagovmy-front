import { BoltIcon, UserIcon } from "@heroicons/react/24/outline";
import { Markdown } from "datagovmy-ui/components";
import { clx } from "datagovmy-ui/helpers";
import { ForwardRefExoticComponent, ForwardedRef, forwardRef, useEffect, useState } from "react";

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
      <div className="flex items-start gap-2" ref={ref}>
        {
          {
            assistant: (
              <div className="bg-primary dark:bg-primary-dark flex aspect-square min-w-[32px] items-center justify-center rounded-lg">
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
          className={clx(
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
export default ChatBubble;
