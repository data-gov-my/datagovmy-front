import Folder from "./folder";
import { clx } from "datagovmy-ui/helpers";
import { FunctionComponent, ReactNode, useContext } from "react";
import File from "./file";
import { FolderPlusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { FileNode, FileType, FiletreeContext } from "./utils";
import { Button } from "datagovmy-ui/components";
import BranchNode from "./branch";
import { Cog6ToothIcon, MegaphoneIcon, TrashIcon } from "@heroicons/react/24/outline";

interface TreeNodeProps {
  node?: FileNode;
}

export const TreeNode: FunctionComponent<TreeNodeProps> = ({ node }) => {
  if (!node) return;

  if (node.name === "root") {
    return node.children.length <= 0 ? (
      <div className="text-dim flex h-full flex-col items-center justify-center gap-4 ">
        <MegaphoneIcon className="h-5 w-5" />
        <p className="text-center text-sm italic">
          Start a conversation to explore the data Malaysia has collected so far.
        </p>
      </div>
    ) : (
      <BranchNode node={node} />
    );
  }

  return (
    <li>
      {
        {
          [FileType.FOLDER]: <Folder node={node} />,
          [FileType.FILE]: <File node={node} />,
        }[node.type]
      }
    </li>
  );
};

interface FiletreeProps {
  className?: string;
}

const Filetree: FunctionComponent<FiletreeProps> = ({ className }) => {
  const { tree, create, reset } = useContext(FiletreeContext);

  return (
    <div className="dark:border-r-washed-dark hidden h-[90vh] flex-col justify-between border-r lg:flex lg:w-1/4 xl:w-1/5">
      <div className="flex gap-2 border-b py-4 pr-3">
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => create(FileType.FILE)}
          icon={<PlusIcon className="h-4 w-4" />}
          title="New chat"
        >
          New chat
        </Button>
        <Button
          variant="default"
          onClick={() => create(FileType.FOLDER)}
          icon={<FolderPlusIcon className="h-4 w-4" />}
          title="New folder"
        />
      </div>

      <ul className={clx("flex grow flex-col gap-2 overflow-auto py-3 pr-3")}>
        <TreeNode node={tree} />
      </ul>
      <div className="border-t py-3 pr-3">
        <Button
          variant="base"
          className="hover:bg-washed w-full gap-3 py-2"
          onClick={() => reset()}
          icon={<TrashIcon className="h-4.5 w-4.5" />}
          title="Clear conversations"
        >
          Clear conversations
        </Button>
        <Button
          variant="base"
          className="hover:bg-washed w-full gap-3 py-2"
          onClick={() => reset()}
          icon={<Cog6ToothIcon className="h-4.5 w-4.5" />}
          title="Settings"
        >
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Filetree;
