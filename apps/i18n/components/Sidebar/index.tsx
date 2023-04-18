"use client";
import { Disclosure } from "@headlessui/react";
import { FunctionComponent } from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import AddTranslation from "client/add-translation";

interface SidebarProps {
  options?: Record<string, string[]> | string[];
  onChange: ([lang, filename]: [string, string]) => void;
}

const Sidebar: FunctionComponent<SidebarProps> = ({ options = dummy, onChange }) => {
  const recurFileDir = (options: Record<string, string[]> | string[], key?: string): any => {
    if (isFile(options)) {
      return (
        <Disclosure>
          {({ open }) => (
            <>
              <div className="relative text-sm text-slate-300">
                <Disclosure.Button
                  className="flex w-full items-center gap-1 px-4 py-1 text-xs focus:bg-[#141313]"
                  onClick={e => e.stopPropagation()}
                >
                  <ChevronRightIcon
                    className={["h-4 w-4 text-sm transition-transform", open && "rotate-90"]
                      .filter(Boolean)
                      .join(" ")}
                  />
                  <span>{key}</span>
                </Disclosure.Button>
                <div className="border-outlineHover-dark ml-7 flex flex-col border-l">
                  {options.map(option => (
                    <Disclosure.Panel key={option}>
                      <button
                        className="group flex w-full items-end gap-2 py-1 pl-2 text-xs focus:bg-[#141313]"
                        onClick={() => onChange([key!, option])}
                      >
                        <span className="text-yellow-300">{`{}`}</span>
                        <span className="text-slate-300 group-focus:text-white">{option}</span>
                      </button>
                    </Disclosure.Panel>
                  ))}
                </div>
              </div>
            </>
          )}
        </Disclosure>
      );
    }

    return Object.entries(options).map(([key, values]) => recurFileDir(values, key));
  };

  const isFile = (options: Record<string, string[]> | string[]): options is string[] => {
    return Array.isArray(options);
  };
  return (
    <div className="w-1/5 bg-black">
      <div className="flex justify-between bg-[#141313] px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-200">
        <span>datagovmy</span>

        <AddTranslation />
      </div>
      {recurFileDir(options)}
    </div>
  );
};

export default Sidebar;

const dummy = {
  "en-GB": [
    "common.json",
    "dashboard-blood-donation.json",
    "dashboard-organ-donation.json",
    "dashboard-peka-b40.json",
  ],
  "ms-MY": [
    "common.json",
    "dashboard-blood-donation.json",
    "dashboard-organ-donation.json",
    "dashboard-peka-b40.json",
  ],
};
