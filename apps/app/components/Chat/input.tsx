import { Button, Textarea } from "datagovmy-ui/components";
import { FunctionComponent, useContext } from "react";
import { ChatContext } from "./utils";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface ChatInputProps {}

const ChatInput: FunctionComponent<ChatInputProps> = () => {
  const { prompt, setPrompt, submitPrompt } = useContext(ChatContext);
  return (
    <div className="relative flex w-full items-center gap-2">
      <Textarea
        className="shadow-floating max-h-[30vh] w-full bg-white py-3 text-sm dark:border-transparent lg:text-base"
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
  );
};

export default ChatInput;
