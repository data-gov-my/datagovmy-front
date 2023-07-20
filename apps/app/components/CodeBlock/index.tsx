import Dropdown from "@components/Dropdown";
import { DocumentDuplicateIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import { GithubThemes } from "./theme";
import { OptionType } from "@components/types";
import { copyClipboard } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { track } from "@lib/mixpanel";
import { useTheme } from "next-themes";

interface CodeBlockProps {
  children: string;
  event?: Record<string, any>;
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({ children, event }) => {
  const { t } = useTranslation();
  const { theme = "light" } = useTheme();
  hljs.registerLanguage("python", python);
  const languageOptions: OptionType[] = [
    {
      label: "Python",
      value: "python",
    },
  ];
  const [language, setLanguage] = useState<OptionType>(languageOptions[0]);
  const [copyText, setCopyText] = useState<string>(t("common.copy"));

  useEffect(() => {
    const head = document.head;
    let code_theme = document.getElementById("code-theme");
    if (code_theme === null) {
      code_theme = document.createElement("style");
      code_theme.setAttribute("id", "code-theme");
    }

    code_theme.innerHTML = GithubThemes[theme as "light" | "dark"];
    head.append(code_theme);
  }, [theme]);

  const html = useMemo<string>(
    () => hljs.highlight(children, { language: language.value }).value,
    [language, children]
  );

  const handleCopy = () => {
    track("code_copy", { language: language.value, ...event });
    copyClipboard(children);
    setCopyText(t("common.copied"));
    setTimeout(() => {
      setCopyText(t("common.copy"));
    }, 1000);
  };
  return (
    <div className="dark:border-outlineHover-dark bg-background dark:bg-background-dark h-fit rounded-xl border">
      <div className="border-outline flex justify-between border-b border-opacity-20 p-1">
        <Dropdown
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
          className="whitespace-pre-wrap break-all"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </div>
    </div>
  );
};

export default CodeBlock;
