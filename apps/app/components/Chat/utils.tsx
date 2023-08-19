import { IndexedDB } from "@lib/idb";
import { useSessionStorage, useWatch } from "datagovmy-ui/hooks";
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
  useState,
} from "react";
import emitter from "@lib/events";
import { FileType, FiletreeContext } from "@components/Filetree/utils";

interface ChatContextProps extends ChatInterface {
  prompt: string;
  session?: ChatSession;
}

export interface ChatInterface {
  setPrompt: Dispatch<SetStateAction<string>>;
  submitPrompt: (prompt: string) => void;
}

interface ChatProviderProps {
  model: string;
  children: ReactNode;
  ref?: ForwardedRef<ChatInterface>;
}

export type ChatType = {
  from: "assistant" | "user";
  text: string;
};

type ChatSession = {
  id: string;
  chats: ChatType[];
};

export const ChatContext = createContext<ChatContextProps>({
  prompt: "",
  setPrompt: () => {},
  submitPrompt: () => {},
});
/**
 * Manages Chat operations
 * @param {string} model Db model
 * @returns {prompt, session, setPrompt}
 */
export const ChatProvider: ForwardRefExoticComponent<ChatProviderProps> = forwardRef(
  ({ model, children }, ref) => {
    const { active, create: createChatSession } = useContext(FiletreeContext);
    const [prompt, setPrompt] = useSessionStorage<string>("prompt", "");
    const [session, setSession] = useState<ChatSession | undefined>();
    const idb = new IndexedDB(model);

    useEffect(() => {
      const fetchDB = async (id: string) => idb.read<ChatSession>(id);

      if (!active || active.type === FileType.FOLDER) return;
      fetchDB(active.id)
        .then(session => session && setSession(session))
        .catch(e => console.error(e));
    }, [active]);

    useEffect(() => {
      emitter.on("chat-delete", destroySession);
      emitter.on("chat-create", createSession);

      return () => {
        emitter.off("chat-create", createSession);
        emitter.off("chat-delete", destroySession);
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
          chats: [{ from: "user", text: text.trim() }],
        };
      } else {
        _session.chats.push({ from: "user", text: text.trim() });
      }
      setSession({ ..._session });
    };

    const createSession = (id: string) => {
      const new_session = { id, chats: [] };
      console.debug("session created:", new_session);
      setSession(new_session);
    };

    const destroySession = (id: string | string[]) => {
      idb
        .destroy(id)
        .then(() => setSession(undefined))
        .catch(e => console.error(e));
    };

    const saveSession = async (): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (!session) {
          return reject("Undefined session");
        }
        const node = await idb.read(session.id);

        if (!node) await idb.write(session).catch(e => console.error(e));
        else await idb.update(session).catch(e => console.error(e));

        resolve();
      });
    };

    return (
      <ChatContext.Provider
        value={{
          prompt,
          session,
          setPrompt,
          submitPrompt,
        }}
      >
        {children}
      </ChatContext.Provider>
    );
  }
);

ChatProvider.displayName = "ChatProvider";
