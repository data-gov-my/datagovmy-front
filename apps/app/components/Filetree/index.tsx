import Folder from "./folder";
import { clx } from "datagovmy-ui/helpers";
import { FunctionComponent, ReactNode, useContext } from "react";
import File from "./file";
import { FolderPlusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { FileNode, FileType, FiletreeContext } from "./utils";
import { Button, SidebarNew } from "datagovmy-ui/components";
import BranchNode from "./branch";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  MegaphoneIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "datagovmy-ui/hooks";

interface TreeNodeProps {
  node?: FileNode;
  onClick?: () => void;
}

export const TreeNode: FunctionComponent<TreeNodeProps> = ({ node, onClick }) => {
  const { t } = useTranslation(["datagpt", "common"]);
  if (!node) return;

  if (node.name === "root") {
    return node.children.length <= 0 ? (
      <div className="text-dim flex h-full flex-col items-center justify-center gap-4 ">
        <MegaphoneIcon className="h-5 w-5" />
        <p className="text-center text-sm italic">{t("empty_chat_placeholder")}</p>
      </div>
    ) : (
      <BranchNode node={node} onClick={onClick} />
    );
  }

  return (
    <li>
      {
        {
          [FileType.FOLDER]: <Folder node={node} onClick={onClick} />,
          [FileType.FILE]: <File node={node} onClick={onClick} />,
        }[node.type]
      }
    </li>
  );
};

interface FiletreeProps {
  className?: string;
}

const Filetree: FunctionComponent<FiletreeProps> = ({ className }) => {
  const { t } = useTranslation(["datagpt", "common"]);
  const { tree, create, reset, active } = useContext(FiletreeContext);

  return (
    <SidebarNew
      mobileTrigger={open => (
        <div className="flex items-center gap-3 border-b py-2">
          <Button variant="default" onClick={open} icon={<Bars3Icon className="h-4 w-4" />}>
            {t("settings")}
          </Button>

          <p className="text-sm">{active?.type === FileType.FILE && active.name}</p>
        </div>
      )}
    >
      {close => (
        <div className="flex h-full max-h-[92vh] flex-col justify-between px-3 lg:pl-0 ">
          {/* Create Chat / Folder */}
          <div className="dark:border-washed-dark flex gap-2 border-b py-4 ">
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => create(FileType.FILE)}
              icon={<PlusIcon className="h-4 w-4" />}
              title={t("new_chat")}
            >
              {t("new_chat")}
            </Button>
            <Button
              variant="default"
              onClick={() => create(FileType.FOLDER)}
              icon={<FolderPlusIcon className="h-4 w-4" />}
              title={t("new_folder")}
            />
          </div>

          {/* Chat directory */}
          <ul className={clx("flex grow flex-col gap-2 overflow-auto py-3")}>
            <TreeNode node={tree} onClick={close} />
          </ul>
          {/* Clear conversation & Settings */}
          <div className="dark:border-washed-dark border-t py-3">
            <Button
              variant="base"
              className="hover:bg-washed dark:hover:bg-washed-dark w-full gap-3 py-2"
              onClick={() => reset()}
              icon={<TrashIcon className="h-4.5 w-4.5" />}
              title={t("clear_conversations")}
            >
              {t("clear_conversations")}
            </Button>
            {/* <Button
              variant="base"
              className="hover:bg-washed dark:hover:bg-washed-dark w-full gap-3 py-2"
              onClick={() => {
                alert("what to do here");
              }}
              icon={<Cog6ToothIcon className="h-4.5 w-4.5" />}
              title="Settings"
            >
              Settings
            </Button> */}
          </div>
        </div>
      )}
    </SidebarNew>
  );
};

export default Filetree;
