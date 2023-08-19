import { clx } from "datagovmy-ui/helpers";
import { FunctionComponent, ReactNode, useState, MouseEventHandler, useContext } from "react";
import { FileNode } from "./utils";
import { Button, toast } from "datagovmy-ui/components";
import { FiletreeContext } from "./utils";
import {
  ChatBubbleBottomCenterTextIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface FileProps {
  className?: string;
  node: FileNode;
  enableAction?: boolean;
}

const File: FunctionComponent<FileProps> = ({ node, className, enableAction = true }) => {
  const { active, setActive, destroy, rename } = useContext(FiletreeContext);
  const [editable, setEditable] = useState<boolean>(false);
  const [name, setName] = useState<string>(node.name);

  const finishEdit = () => {
    if (name.length <= 0) {
      toast.error("Must not be empty");
      return;
    }
    setEditable(false);
    rename(node, name);
  };

  return (
    <div
      className={clx(
        className,
        "hover:bg-washed group flex cursor-pointer justify-between px-3 py-2 text-sm",
        active?.id === node.id && "bg-washed dark:bg-washed-dark ",
        node?.parent?.parent === null ? "rounded-md" : "rounded-r-md"
      )}
      onClick={e => {
        e.stopPropagation();
        setActive(node);
      }}
    >
      {!editable ? (
        <div className="flex items-center gap-3">
          <ChatBubbleBottomCenterTextIcon className="-ml-1 h-4 w-4" />
          <p className="truncate" title={node.name}>
            {node.name}
          </p>
        </div>
      ) : (
        <input
          className="py-1 text-sm"
          autoFocus
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              finishEdit();
            }
          }}
          onBlur={finishEdit}
        />
      )}
      {enableAction && !editable && (
        <div className="text-dim opacity-0 transition group-hover:opacity-100">
          <ul className="flex w-fit flex-row gap-1">
            <li>
              <Button
                variant="reset"
                className="transition hover:text-black"
                onClick={() => setEditable(true)}
                title="Rename chat"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Button>
            </li>
            <li>
              <Button
                variant="reset"
                className="transition hover:text-black"
                onClick={() => destroy(node)}
                title="Delete chat"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default File;
