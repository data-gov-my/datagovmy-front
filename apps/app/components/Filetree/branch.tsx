import { FunctionComponent } from "react";
import { FileNode } from "./utils";
import { TreeNode } from ".";

interface BranchProps {
  node: FileNode;
  onClick?: () => void;
}

const BranchNode: FunctionComponent<BranchProps> = ({ node, onClick }) => (
  <ul>
    {node.children.map(child => (
      <TreeNode key={child.id} node={child} onClick={onClick} />
    ))}
  </ul>
);

export default BranchNode;
