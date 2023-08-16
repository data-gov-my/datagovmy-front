import Folder from "./folder";
import { clx } from "datagovmy-ui/helpers";
import { FunctionComponent, useRef } from "react";
import File from "./file";
import { FileNode, FileNodeInterface, FileType, FiletreeProvider } from "./utils";

interface TreeNodeProps {
  node: FileNode;
}

// Recursive component to render a node and its children
const TreeNode: FunctionComponent<TreeNodeProps> = ({ node }) => {
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
  model: string;
}

const Filetree: FunctionComponent<FiletreeProps> = ({ className, model }) => {
  const fm = useRef<FileNodeInterface>(null);
  return (
    <>
      <div className="flex">
        <button
          className="btn-primary"
          onClick={() => fm.current && fm.current.create(FileType.FILE)}
        >
          New chat
        </button>
        <button
          className="btn-default"
          onClick={() => fm.current && fm.current.create(FileType.FOLDER)}
        >
          New folder
        </button>
      </div>

      <ul
        className={clx(className, "flex grow flex-col gap-2 pr-3")}
        onClick={() => fm.current && fm.current.tree && fm.current.setActive(fm.current.tree)}
      >
        <FiletreeProvider ref={fm} model={model}>
          {tree => tree && <TreeNode node={tree} />}
        </FiletreeProvider>
      </ul>
    </>
  );
};

export default Filetree;
