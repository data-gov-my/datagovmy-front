import { Collapse, Collapsible, CollapsibleContent, CollapsibleTrigger } from "../Collapsible";
import { clx } from "../../lib/helpers";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import cloneDeep from "lodash/cloneDeep";
import { ChangeEventHandler, ComponentProps, useMemo, useState } from "react";

interface Node {
  label: string;
  value: string;
  checked: boolean;
  children: Node[];
  parent?: Node;
}

export default function NestedChecklist({
  data,
  label,
  setData,
}: {
  data: Node;
  label: string;
  setData: (node: Node) => void;
}) {
  const handleBoxChecked: ChangeEventHandler<HTMLInputElement> = e => {
    const node = findNode(data, e.target.value);
    if (node) {
      node.checked = e.target.checked;
      toggleChildren(node);
      updateParent(node);
    }
    setData(cloneDeep(data));
  };

  return (
    <div className="flex flex-col gap-3 lg:min-h-0">
      <label htmlFor={data.value} className="flex items-center gap-1.5 text-sm">
        <Checkbox
          id={data.value}
          value={data.value}
          checked={data.checked}
          onChange={handleBoxChecked}
        />
        <span>{label}</span>
      </label>
      <div className="border-outline dark:border-washed-dark divide-outline dark:divide-washed-dark flex flex-col divide-y overflow-auto rounded-lg border max-lg:h-[400px] lg:max-h-full">
        {data.children.map(node => (
          <Checklist key={node.value} node={node} onChange={handleBoxChecked} />
        ))}
      </div>
    </div>
  );
}

const findNode = (root: Node, value: string) => {
  if (root.value === value) return root;
  let node;

  const data = root.children;
  node = data.find(datum => datum.value === value);
  if (node) return node;

  for (let datum of data) {
    const children = datum.children;
    if (children.length === 0) continue;
    node = children.find(child => child.value === value);
    if (node) return node;
  }
  return node;
};

const toggleChildren = (node: Node) =>
  node.children.forEach(child => {
    child.checked = node.checked;
    toggleChildren(child);
  });

const updateParent = (node: Node) => {
  const parent = node.parent;
  if (!parent) return;

  if (parent.checked && !node.checked) {
    parent.checked = false;
    updateParent(parent);
    return;
  }
  if (!parent.checked && node.checked) {
    if (parent.children.every(child => child.checked)) {
      parent.checked = true;
      updateParent(parent);
      return;
    }
  }
  return;
};

const Checklist = ({
  defaultOpen = true,
  node,
  onChange,
}: {
  defaultOpen?: boolean;
  node: Node;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const total = useMemo(
    () => node.children.reduce((acc, cur) => (cur.checked ? acc + 1 : acc), 0),
    [node]
  );

  return (
    <Collapsible defaultOpen={defaultOpen} open={true}>
      <div className="flex w-full min-w-0 max-w-full items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 max-w-full items-center gap-1.5 font-bold">
          <Checkbox id={node.value} checked={node.checked} value={node.value} onChange={onChange} />
          <label htmlFor={node.value} className="max-w-full truncate">
            {node.label}
          </label>
          <div
            className={clx(
              "bg-outlineHover dark:bg-outlineHover-dark flex shrink-0 items-center justify-center rounded-full text-sm font-medium text-white",
              total > 9 ? "px-1.5" : "size-4.5"
            )}
          >
            {total}
          </div>
        </div>

        <CollapsibleTrigger
          className=""
          onClick={e => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          <ChevronDownIcon
            className={clx("size-4.5 transition", open ? "rotate-180" : "rotate-0")}
          />
        </CollapsibleTrigger>
      </div>
      <Collapse
        isOpen={open}
        className={clx(
          "transition-opacity duration-500 ease-in-out",
          open ? "opacity-100" : "opacity-0"
        )}
      >
        <CollapsibleContent className="p-4 pl-8 pt-2">
          <ul className="flex flex-col gap-4">
            {node.children.map(({ label, value, checked }) => (
              <li key={value} className="flex items-center gap-1.5 text-sm">
                <Checkbox id={value} value={value} checked={checked} onChange={onChange} />
                <label htmlFor={value}>{label}</label>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapse>
    </Collapsible>
  );
};

const Checkbox = (props: ComponentProps<"input">) => (
  <input
    {...props}
    type="checkbox"
    className="size-4.5 shadow-button border-outline dark:border-washed-dark rounded border focus:ring-0 focus:ring-transparent"
  />
);
