import Dropdown from "@components/Dropdown";
import { DocumentDuplicateIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import html_xml from "highlight.js/lib/languages/xml";
import { GithubThemes } from "./theme";
import { clx, copyClipboard } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { track } from "@lib/mixpanel";
import { useTheme } from "next-themes";

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
    label: "HTML",
    value: "html",
  },
] as const;

export type Language = (typeof LANGUAGE_OPTIONS)[number]["value"];

interface CodeBlockProps {
  children: Partial<Record<Language, string>>;
  hidden?: boolean;
  event?: Record<string, any>;
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({ children, hidden, event }) => {
  const { t } = useTranslation();
  const { theme = "light" } = useTheme();
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("html", html_xml);

  const languageOptions = LANGUAGE_OPTIONS.filter(({ value }) => {
    return Object.keys(children).includes(value);
  });

  const [language, setLanguage] = useState<(typeof LANGUAGE_OPTIONS)[number]>(languageOptions[0]);
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
    () => hljs.highlight(children[language.value] ?? "", { language: language.value }).value,
    [language, children]
  );

  const handleCopy = () => {
    track("code_copy", { language: language.value, ...event });
    copyClipboard(children[language.value] ?? "");
    setCopyText(t("common.copied"));
    setTimeout(() => {
      setCopyText(t("common.copy"));
    }, 1000);
  };
  return (
    <div className="dark:border-outlineHover-dark bg-background dark:bg-background-dark h-fit rounded-xl border">
      <div className="border-outlineHover flex justify-between border-b border-opacity-20 p-1">
        <Dropdown
          className={clx(hidden ? "invisible" : "visible", "w-fit")}
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
      <div className="p-3 text-xs">
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
