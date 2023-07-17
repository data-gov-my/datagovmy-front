import Dropdown from "@components/Dropdown";
import { DocumentDuplicateIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, useState } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import javscript from "highlight.js/lib/languages/javascript";
// import kotlin from "highlight.js/lib/languages/kotlin";
// import julia from "highlight.js/lib/languages/julia";
// import r from "highlight.js/lib/languages/r";
import "highlight.js/styles/shades-of-purple.css";
import { copyClipboard } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { track } from "@lib/mixpanel";

const LANGUAGE_OPTIONS = [
  {
    label: "Python",
    value: "python",
  },
  {
    label: "JavaScript",
    value: "javascript",
  },
  {
    label: "Kotlin",
    value: "kotlin",
  },
] as const;

export type Language = (typeof LANGUAGE_OPTIONS)[number]["value"];

interface CodeBlockProps {
  children: Partial<Record<Language, string>>;
  event?: Record<string, any>;
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({ children, event }) => {
  const { t } = useTranslation();
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("javascript", javscript);
  // hljs.registerLanguage("kotlin", kotlin);

  //   hljs.registerLanguage("julia", julia);
  //   hljs.registerLanguage("r", r);

  const languageOptions = LANGUAGE_OPTIONS.filter(({ value }) => {
    return Object.keys(children).includes(value);
  });

  const [language, setLanguage] = useState<(typeof LANGUAGE_OPTIONS)[number]>(languageOptions[0]);
  const [copyText, setCopyText] = useState<string>(t("common.copy"));

  const handleCopy = () => {
    track("code_copy", { language: language.value, ...event });
    copyClipboard(children[language.value] ?? "");
    setCopyText(t("common.copied"));
    setTimeout(() => {
      setCopyText(t("common.copy"));
    }, 1000);
  };
  return (
    <div className="dark:border-outlineHover-dark dark:bg-background-dark rounded-xl border bg-black">
      <div className="border-outline flex justify-between border-b border-opacity-20 p-2.5 text-white">
        <Dropdown
          darkMode
          className="flex-row items-center"
          sublabel={<GlobeAltIcon className="mr-2 h-4 w-4" />}
          options={languageOptions}
          selected={language}
          onChange={e => setLanguage(e)}
          width="w-min"
        />
        <button className="btn text-dim hover:bg-washed/10 px-3 py-1.5" onClick={handleCopy}>
          <DocumentDuplicateIcon className="h-4 w-4" />
          {copyText}
        </button>
      </div>
      <div className="p-4.5 text-xs">
        <code
          className="whitespace-pre-wrap break-all text-white"
          dangerouslySetInnerHTML={{
            __html: hljs.highlight(children[language.value] ?? "", { language: language.value })
              .value,
          }}
        />
      </div>
    </div>
  );
};

export default CodeBlock;
