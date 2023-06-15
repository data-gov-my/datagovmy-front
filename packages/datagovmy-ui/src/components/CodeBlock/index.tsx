import Button from "src/components/Button";
import Dropdown from "src/components/Dropdown";
import { DocumentDuplicateIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, useState } from "react";
import hljs from "highlight.js";
// import python from "highlight.js/";
// import julia from "highlight.js/src/lib/languages/julia";
// import r from "highlight.js/src/lib/languages/r";
import "highlight.js/styles/shades-of-purple.css";
import { OptionType } from "src/components/types";
import { copyClipboard } from "src/lib/helpers";
import { useTranslation } from "src/hooks/useTranslation";
import { track } from "src/lib/mixpanel";

interface CodeBlockProps {
  children: string;
  event?: Record<string, any>;
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({ children, event }) => {
  const { t } = useTranslation();
  // hljs.registerLanguage("python", python);
  //   hljs.registerLanguage("julia", julia);
  //   hljs.registerLanguage("r", r);
  const languageOptions: OptionType[] = [
    {
      label: "Python",
      value: "python",
    },
  ];
  const [language, setLanguage] = useState<OptionType>(languageOptions[0]);
  const [copyText, setCopyText] = useState<string>(t("common.copy"));

  const handleCopy = () => {
    track("code_copy", { language: language.value, ...event });
    copyClipboard(children);
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
        <Button
          className="text-dim hover:bg-washed/10 text-sm"
          icon={<DocumentDuplicateIcon className="h-4 w-4" />}
          onClick={handleCopy}
        >
          {copyText}
        </Button>
      </div>
      <div className="p-4.5 text-xs">
        <code
          className="whitespace-pre-wrap break-all text-white"
          dangerouslySetInnerHTML={{
            __html: hljs.highlight(children, { language: language.value }).value,
          }}
        />
      </div>
    </div>
  );
};

export default CodeBlock;