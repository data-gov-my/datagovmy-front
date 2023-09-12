import emitter from "@lib/events";
import { IndexedDB } from "@lib/idb";
import { useTranslation, useWatch } from "datagovmy-ui/hooks";
import {
  ForwardRefExoticComponent,
  ForwardedRef,
  ReactNode,
  createContext,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

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
    public parent: FileNode | undefined | null,
    id?: string
  ) {
    this.id = id !== undefined ? id : this.uuid(parent === null);
  }

  public static find(node: FileNode, id: string): FileNode | null {
    if (node.id === id) {
      return node;
    }
    for (const child of node.children) {
      const foundNode = this.find(child, id);
      if (foundNode !== null) return foundNode;
    }
    return null;
  }

  public traverse(callback: (node: FileNode) => void) {
    callback(this);
    for (const child of this.children) {
      child.traverse(callback);
    }
  }

  private uuid(isRoot?: boolean) {
    return isRoot
      ? "root"
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
  }

  public clone(): FileNode {
    return new FileNode(
      this.name,
      this.type,
      this.children.map(child => child.clone()),
      this.parent,
      this.id
    );
  }

  public serialize(): Record<string, any> {
    const serialized_nodes: any[] = [];

    this.traverse(node => {
      const serialized_node: any = {
        id: node.id,
        name: node.name,
        type: node.type,
      };

      if (node.parent) {
        serialized_node.parentId = node.parent.id;
      } else {
        serialized_node.parentId = null; // For the root node
      }

      serialized_nodes.push(serialized_node);
    });

    const serialized_data = {
      id: this.id,
      nodes: serialized_nodes,
    };

    return serialized_data;
  }

  public static deserialize(data: Record<string, any>): FileNode | undefined {
    // Step 1: Deserialize nodes without parent references
    const nodeMap = new Map<string, FileNode>();
    for (const serialized_node of data.nodes) {
      const node = new FileNode(
        serialized_node.name,
        serialized_node.type,
        [],
        null,
        serialized_node.id
      );
      nodeMap.set(node.id, node);
    }

    // Step 2: Attach parent references
    for (const serialized_node of data.nodes) {
      const node = nodeMap.get(serialized_node.id);
      if (serialized_node.parentId) {
        const parent = nodeMap.get(serialized_node.parentId);
        if (node && parent) {
          parent.children.push(node);
          node.parent = parent;
        }
      }
    }

    return nodeMap.get(data.id);
  }

  // Method only for root node
  public async save(idb?: IndexedDB): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!idb) return reject("IndexedDB is undefined");
      if (!this.id.includes("root")) return reject("Error: Method must be called from root node");

      const node = await idb.read(this.id);

      if (!node) await idb.write(this.serialize()).catch(e => console.error(e));
      else await idb.update(this.serialize()).catch(e => console.error(e));

      resolve();
    });
  }
}

interface FiletreeContextProps extends FileNodeInterface {
  tree: FileNode | undefined;
  active: FileNode | undefined;
}

export interface FileNodeInterface {
  tree: FileNode | undefined;
  reset: () => void;
  create: (type: FileType) => FileNode | null;
  destroy: (node: FileNode) => void;
  rename: (node: FileNode, rename: string) => void;
  setActive: (node: FileNode) => void;
}

interface FiletreeProviderProps {
  model: string;
  children: ReactNode;
  ref?: ForwardedRef<FileNodeInterface>;
}

export const FiletreeContext = createContext<FiletreeContextProps>({
  tree: undefined,
  active: undefined,
  setActive: () => {},
  create: () => null,
  destroy: () => {},
  rename: () => {},
  reset: () => {},
});

/**
 * Manages FileNode operations like a 'file manager'
 * @param {FileNode} root Root file node
 * @returns {tree, active, setActive, create, destroy, rename}
 */
export const FiletreeProvider: ForwardRefExoticComponent<FiletreeProviderProps> = forwardRef(
  ({ children, model }, ref) => {
    const { t } = useTranslation(["datagpt", "common"]);
    const idb = useRef<IndexedDB>();
    const [tree, setTree] = useState<FileNode | undefined>();
    const [active, setActive] = useState<FileNode | undefined>();

    useEffect(() => {
      idb.current = new IndexedDB(model);
      const fetchDB = async () => await idb.current!.read("root");

      fetchDB().then(tree => {
        if (tree) {
          setTree(FileNode.deserialize(tree));
          setActive(FileNode.deserialize(tree));
        } else {
          const root = new FileNode("root", FileType.FOLDER, [], null);
          const child = new FileNode("New chat", FileType.FILE, [], root);
          root.children.push(child);
          setTree(root);
          setActive(child);

          emitter.emit("chat-create", child.id);
          root.save(idb.current);
        }
      });
    }, []);

    useWatch(() => {
      if (tree) tree.save(idb.current);
    }, [tree]);

    /** Public functions */
    const create = (type: FileType) => {
      const new_node = new FileNode(
        type === FileType.FOLDER ? t("new_folder") : t("new_chat"),
        type,
        [],
        undefined
      );
      setTree(_root => {
        if (!_root || !active) return;
        const _tree = _root.clone();
        let _node: FileNode | null = null;

        switch (active.type) {
          case FileType.FOLDER:
            _node = FileNode.find(_tree, active.id);
            break;
          case FileType.FILE:
            _node = FileNode.find(_tree, active.parent?.id || _root.id);
            break;
        }

        if (!_node || _node === null) return _tree;

        new_node.parent = _node;
        _node.children.push(new_node);
        setActive(new_node);
        if (new_node.type === FileType.FILE) {
          emitter.emit("chat-create", new_node.id);
        }
        return _tree;
      });

      return new_node;
    };

    const destroy = (node: FileNode) => {
      setTree(_root => {
        if (!_root) return;
        const _tree = _root.clone();
        deleteNode(_tree, node.id);
        setActive(_tree);
        return _tree;
      });
      const ids: string[] = [];
      node.traverse(node => {
        if (node.type === FileType.FILE) ids.push(node.id);
      });
      emitter.emit("chat-delete", ids);
    };

    const rename = (node: FileNode, rename: string) => {
      setTree(_root => {
        if (!_root) return;
        const _tree = _root.clone();
        const _node = FileNode.find(_tree, node.id);
        if (_node) _node.name = rename;
        return _tree;
      });
    };

    const reset = () => {
      emitter.emit("chat-reset");
      const root = new FileNode("root", FileType.FOLDER, [], null, "root");
      root.save(idb.current);
      setTree(root);
    };

    /** Ref functions */
    useImperativeHandle(ref, () => {
      return { tree, create, destroy, rename, setActive, reset };
    });

    /** Private functions */
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
          reset,
        }}
      >
        {children}
      </FiletreeContext.Provider>
    );
  }
);

FiletreeProvider.displayName = "FiletreeProvider";
