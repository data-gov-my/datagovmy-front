import {
  ForwardRefExoticComponent,
  ForwardedRef,
  ReactNode,
  createContext,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

// export type FileType = "dir" | "file";

export enum FileType {
  FOLDER = "dir",
  FILE = "file",
}
/**
 * FileNode.
 * @property {string} name Name of file (Display name)
 * @property {FileType} type dir | file
 * @property {FileNode[]} children Child FileNodes
 * @property {FileNode} parent Parent FileNode
 * @property {id?} id (optional) Allow passing of ID for cloning
 */
export class FileNode {
  public id: string;

  constructor(
    public name: string,
    public type: FileType,
    public children: FileNode[] = [],
    public parent: FileNode | null = null,
    id?: string
  ) {
    this.id = id !== undefined ? id : this.uuid();
  }

  uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  clone(): FileNode {
    return new FileNode(
      this.name,
      this.type,
      this.children.map(child => child.clone()),
      this.parent,
      this.id
    );
  }
}

interface FiletreeContextProps extends FileNodeInterface {
  tree: FileNode | null;
  active: FileNode | null;
}

export interface FileNodeInterface {
  create: (type: FileType) => void;
  destroy: (node: FileNode) => void;
  rename: (node: FileNode, rename: string) => void;
  setActive: (node: FileNode) => void;
}

interface FiletreeProviderProps {
  root: FileNode;
  children: (tree: FileNode) => ReactNode;
  ref: ForwardedRef<FileNodeInterface>;
}

export const FiletreeContext = createContext<FiletreeContextProps>({
  tree: null,
  active: null,
  setActive: () => {},
  create: () => {},
  destroy: () => {},
  rename: () => {},
});

/**
 * Manages FileNode operations like a 'file manager'
 * @param {FileNode} root Root file node
 * @returns {tree, active, setActive, create, destroy, rename}
 */
export const FiletreeProvider: ForwardRefExoticComponent<FiletreeProviderProps> = forwardRef(
  ({ root, children }, ref) => {
    const [tree, setTree] = useState<FileNode>(root);
    const [active, setActive] = useState<FileNode>(root);

    /** Public functions */
    const create = (type: FileType) => {
      setTree(_root => {
        const _tree = _root.clone();
        const _node =
          active.parent === null ? _tree : active.type === FileType.FOLDER ? active : active.parent;
        const parentNode = findNode(_tree, _node.id);
        if (parentNode)
          parentNode.children.push(
            new FileNode(type === FileType.FOLDER ? "New folder" : "New chat", type, [], parentNode)
          );

        return _tree;
      });
    };

    const destroy = (node: FileNode) => {
      setTree(_root => {
        const _tree = _root.clone();
        deleteNode(_tree, node.id);
        return _tree;
      });
    };

    const rename = (node: FileNode, rename: string) => {
      setTree(_root => {
        const _tree = _root.clone();
        const _node = findNode(_tree, node.id);
        if (_node) _node.name = rename;
        return _tree;
      });
    };

    /** Ref functions */
    useImperativeHandle(ref, () => {
      return { create, destroy, rename, setActive };
    });

    /** Private functions */
    const findNode = (node: FileNode, id: string): FileNode | null => {
      if (node.id === id) {
        return node;
      }
      for (const child of node.children) {
        const foundNode = findNode(child, id);
        if (foundNode !== null) return foundNode;
      }
      return null;
    };

    const deleteNode = (root: FileNode, id: string) => {
      if (root === null) {
        return; // Empty tree
      }

      const updatedChildren = root.children.filter(child => child.id !== id);

      for (const child of root.children) {
        deleteNode(child, id);
      }

      root.children = updatedChildren;
    };

    return (
      <FiletreeContext.Provider
        value={{
          tree,
          active,
          setActive,
          create,
          destroy,
          rename,
        }}
      >
        {children(tree)}
      </FiletreeContext.Provider>
    );
  }
);

FiletreeProvider.displayName = "FiletreeProvider";
