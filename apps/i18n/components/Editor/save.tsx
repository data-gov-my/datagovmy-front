"use client";

import { FunctionComponent } from "react";

interface SaveEditorProps {
  isDirty?: boolean;
  filePath: string[];
}

const SaveEditor: FunctionComponent<SaveEditorProps> = ({ isDirty, filePath }) => {
  if (filePath.length <= 0) return null;
  return (
    <div className="border-washed-dark flex w-full items-center gap-4 border-b bg-black px-3 py-1 text-sm">
      <p className="flex gap-2  font-medium">
        <span className="text-yellow-300">{`{}`}</span>
        <span className="text-slate-300">{filePath.join(" / ")}</span>
      </p>
      {isDirty && (
        <>
          <p className="text-dim text-xs italic">unsaved changes</p>
          <button className="from-primary hover:to-primary block rounded-md border border-transparent bg-gradient-to-t to-[#3E7AFF] px-2 text-xs text-white">
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default SaveEditor;
