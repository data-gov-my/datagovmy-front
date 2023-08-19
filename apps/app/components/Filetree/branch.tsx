import { FunctionComponent, ReactNode } from "react";
import { FileNode } from "./utils";
import { TreeNode } from ".";

interface BranchProps {
  node: FileNode;
}

const BranchNode: FunctionComponent<BranchProps> = ({ node }) => (
  <ul>
    {node.children.map(child => (
      <TreeNode key={child.id} node={child} />
    ))}
  </ul>
);

export default BranchNode;
