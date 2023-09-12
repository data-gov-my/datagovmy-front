import { IndexedDB } from "@lib/idb";
import { useData, useSessionStorage, useTranslation } from "datagovmy-ui/hooks";
import {
  Dispatch,
  ForwardRefExoticComponent,
  ForwardedRef,
  ReactNode,
  SetStateAction,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import emitter from "@lib/events";
import { FileType, FiletreeContext } from "@components/Filetree/utils";
import { stream } from "datagovmy-ui/api";

interface ChatContextProps extends ChatInterface {
  prompt: string;
  session?: ChatSession;
  fetching: boolean;
  streamingText: string;
}

export interface ChatInterface {
  setPrompt: Dispatch<SetStateAction<string>>;
  submitPrompt: (prompt: string) => void;
}

interface ChatProviderProps {
  model: string;
  children: ReactNode;
  chain: "main" | "docs";
  ref?: ForwardedRef<ChatInterface>;
}

export type ChatType = {
  role: "assistant" | "user";
  content: string;
};

type ChatSession = {
  id: string;
  chats: ChatType[];
};

export const ChatContext = createContext<ChatContextProps>({
  prompt: "",
  setPrompt: () => {},
  submitPrompt: () => {},
  fetching: false,
  streamingText: "",
});
/**
 * Manages Chat operations
 * @param {string} model Db model
 * @returns {prompt, session, setPrompt}
 */
export const ChatProvider: ForwardRefExoticComponent<ChatProviderProps> = forwardRef(
  ({ model, children, chain }, ref) => {
    const { t } = useTranslation(["datagpt"]);
    const idb = useRef<IndexedDB>();
    const { active, create: createChatSession } = useContext(FiletreeContext);
    const [prompt, setPrompt] = useSessionStorage<string>("prompt", "");
    const [session, setSession] = useState<ChatSession | undefined>();
    const { data, setData } = useData({ fetching: false, text_stream: "" });

    useEffect(() => {
      idb.current = new IndexedDB(model);
      const fetchDB = async (id: string) => idb.current!.read<ChatSession>(id);

      if (!active || active.type === FileType.FOLDER) return;
      fetchDB(active.id)
        .then(session => session && setSession(session))
        .catch(e => console.error(e));
    }, [active]);

    useEffect(() => {
      emitter.on("chat-delete", destroySession);
      emitter.on("chat-create", createSession);
      emitter.on("chat-reset", resetAllSession);

      return () => {
        emitter.off("chat-create", createSession);
        emitter.off("chat-delete", destroySession);
        emitter.off("chat-reset", resetAllSession);
      };
    }, []);

    useEffect(() => {
      if (session) saveSession();
    }, [session, active]);

    const submitPrompt = async (text: string) => {
      let _session: ChatSession | undefined = session;
      if (!_session || active?.type === FileType.FOLDER) {
        const new_session = createChatSession(FileType.FILE);
        if (new_session === null) return;

        _session = {
          id: new_session.id,
          chats: [{ role: "user", content: text.trim() }],
        };
      } else {
        _session.chats.push({ role: "user", content: text.trim() });
      }
      setSession({ ..._session });
      fetchResponse(text);
    };

    // Private functions
    const createSession = (id: string) => {
      const new_session = { id, chats: [] };
      setSession(new_session);
    };

    const destroySession = (id: string | string[]) => {
      if (!idb.current) return;
      idb.current
        .destroy(id)
        .then(() => setSession(undefined))
        .catch(e => console.error(e));
    };

    const resetAllSession = () => {
      if (!idb.current) return;
      idb.current
        .destroyAll()
        .then(() => setSession(undefined))
        .catch(e => console.error(e));
    };

    const saveSession = async (): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (!session) return reject("Undefined session");
        if (!idb.current) return reject("Indexed DB is undefined");

        const node = await idb.current.read(session.id);
        if (!node) await idb.current.write(session).catch(e => console.error(e));
        else await idb.current.update(session).catch(e => console.error(e));

        resolve();
      });
    };

    const fetchResponse = async (prompt: string) => {
      setData("fetching", true);
      const payload = {
        chain_type: chain,
        model: "gpt-3.5-turbo",
        messages: session?.chats.filter(chat => chat.content !== t("prompt_error")).slice(-5) || [
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0,
      };

      try {
        const { body, status } = await stream("/chat", payload);
        if (status !== 200 || !body) {
          throw new Error(t("prompt_error"));
        }

        const reader = body.pipeThrough(new TextDecoderStream()).getReader();
        let _answer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            setData("fetching", false);
            setSession((session: ChatSession | undefined) => {
              if (!session) return;

              return {
                ...session,
                ...{ chats: session.chats.concat({ role: "assistant", content: _answer }) },
              };
            });
            setData("text_stream", "");

            break;
          }
          _answer += value;
          setData("text_stream", _answer);
        }
      } catch (error: any) {
        setData("fetching", false);
        setSession((session: ChatSession | undefined) => {
          if (!session) return;

          return {
            ...session,
            ...{ chats: session.chats.concat({ role: "assistant", content: error.message }) },
          };
        });
        console.error(error.message);
      }
    };

    return (
      <ChatContext.Provider
        value={{
          prompt,
          session,
          setPrompt,
          submitPrompt,
          fetching: data.fetching,
          streamingText: data.text_stream,
        }}
      >
        {children}
      </ChatContext.Provider>
    );
  }
);

ChatProvider.displayName = "ChatProvider";
