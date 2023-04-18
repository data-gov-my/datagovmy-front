"use client";

import Editor from "components/Editor";
import Sidebar from "components/Sidebar";
import { useData } from "hooks/useData";

export default function Translation() {
  const { data, setData } = useData({
    lang_filename: [],
    original_text: "",
    current_text: "",
    loading: false,
  });

  const handleChange = (value: [string, string]) => {
    if (value[1] === data.lang_filename[1]) return;

    // TODO: Fetch the i18n JSON
    setData("lang_filename", value);
  };

  return (
    <main className="flex h-full">
      <Sidebar onChange={handleChange} />
      <div className="flex  w-full flex-col">
        <Editor
          filePath={data.lang_filename}
          defaultValue={data.original_text}
          onChange={text => setData("current_text", text)}
        />
      </div>
    </main>
  );
}
