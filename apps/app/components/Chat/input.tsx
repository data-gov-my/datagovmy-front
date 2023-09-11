import { Button, Textarea } from "datagovmy-ui/components";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { ChatContext } from "./utils";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "datagovmy-ui/hooks";

interface ChatInputProps {}

const ChatInput: FunctionComponent<ChatInputProps> = () => {
  const { prompt, session, setPrompt, submitPrompt, fetching } = useContext(ChatContext);
  const { t } = useTranslation(["datagpt", "common"]);
  const [placeholder, setPlaceholder] = useState<string>("");

  useEffect(() => {
    let _placeholder: string = "";
    if (!session?.chats || session?.chats.length <= 0) {
      _placeholder = t("prompt_placeholder", { context: Math.floor(Math.random() * 4) + 1 });
    } else {
      _placeholder = t("send_message");
    }

    setPlaceholder(_placeholder);
  }, []);
  return (
    <div className="relative flex w-full items-center gap-2">
      <Textarea
        className="shadow-floating max-h-[30vh] w-full bg-white py-3 text-sm dark:border-transparent lg:text-base"
        placeholder={placeholder}
        rows={1}
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
        className="absolute right-3 aspect-square w-8 justify-center rounded-md p-0"
        title={t("prompt_submit")}
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
  );
};

export default ChatInput;
