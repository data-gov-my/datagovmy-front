import Folder from "./folder";
import { clx } from "datagovmy-ui/helpers";
import { FunctionComponent, useContext, useRef } from "react";
import File from "./file";
import { FileNode, FileNodeInterface, FileType, FiletreeContext, FiletreeProvider } from "./utils";

interface TreeNodeProps {
  node?: FileNode;
}

// Recursive component to render a node and its children
const TreeNode: FunctionComponent<TreeNodeProps> = ({ node }) => {
  if (!node) return;
  if (node.name === "root") {
    // Don't render the root node as a selectable item
    return (
      <div>
        {node.children.map(child => (
          <TreeNode key={child.id} node={child} />
        ))}
      </div>
    );
  }

  return (
    <li>
      {node.type === "dir" ? (
        <Folder node={node}>
          {node.children.length > 0 && (
            <ul>
              {node.children.map(child => (
                <TreeNode key={child.id} node={child} />
              ))}
            </ul>
          )}
        </Folder>
      ) : (
        <File node={node} />
      )}
    </li>
  );
};

interface FiletreeProps {
  className?: string;
}

const Filetree: FunctionComponent<FiletreeProps> = ({ className }) => {
  const { tree, active, create } = useContext(FiletreeContext);

  return (
    <div className="dark:border-r-washed-dark hidden h-[90vh] flex-col justify-between border-r lg:flex lg:w-1/4 xl:w-1/5">
      <div className="flex">
        <button className="btn-primary" onClick={() => create(FileType.FILE)}>
          New chat
        </button>
        <button className="btn-default" onClick={() => create(FileType.FOLDER)}>
          New folder
        </button>
      </div>

      <ul className={clx("flex grow flex-col gap-2 overflow-auto pr-3")}>
        <TreeNode node={tree} />
      </ul>
      <div className="border-t py-3">
        <p className="py-2">clear conversations</p>
        <p className="py-2">settings</p>
      </div>
    </div>
  );
};

export default Filetree;
