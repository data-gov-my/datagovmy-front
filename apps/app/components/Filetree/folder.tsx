import { clx } from "datagovmy-ui/helpers";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, ReactNode, useContext, useState } from "react";
import { FileNode, FiletreeContext } from "./utils";
import { Button, toast } from "datagovmy-ui/components";
import BranchNode from "./branch";

type FolderProps = {
  className?: string;
  node: FileNode;
};

const Folder: FunctionComponent<FolderProps> = ({ className, node }) => {
  const { setActive, destroy, rename } = useContext(FiletreeContext);
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
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button
            as="div"
            className={clx(
              "group flex flex-row items-center justify-between px-3 py-2 dark:bg-black",
              "cursor-pointer select-none text-start text-sm font-medium text-black dark:text-white",
              className
            )}
            onClick={e => {
              e.stopPropagation();
              setActive(node);
            }}
          >
            <div className="flex max-w-[80%] flex-row items-center gap-2">
              <ChevronUpIcon
                className={clx(
                  "-ml-1 h-4 w-4 transform transition-transform",
                  open ? "rotate-180" : "rotate-0"
                )}
              />
              {!editable ? (
                <p className="truncate" title={node.name}>
                  {node.name}
                </p>
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
            </div>
            <div className="text-dim opacity-0 transition group-hover:opacity-100">
              <ul className="flex w-fit flex-row gap-1">
                <li>
                  <Button
                    variant="reset"
                    className="transition hover:text-black"
                    onClick={e => {
                      e.stopPropagation();
                      setEditable(true);
                    }}
                  >
                    <PencilSquareIcon className="h-4.5 w-4.5" />
                  </Button>
                </li>
                <li>
                  <Button
                    variant="reset"
                    className="transition hover:text-black"
                    onClick={() => destroy(node)}
                  >
                    <TrashIcon className="h-4.5 w-4.5" />
                  </Button>
                </li>
              </ul>
            </div>
          </Disclosure.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="ml-4 border-l">
              <BranchNode node={node} />
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Folder;
