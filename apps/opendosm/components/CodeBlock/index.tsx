import Button from "@components/Button";
import Dropdown from "@components/Dropdown";
import { DocumentDuplicateIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, useState } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
// import julia from "highlight.js/lib/languages/julia";
// import r from "highlight.js/lib/languages/r";
import "highlight.js/styles/shades-of-purple.css";
import { OptionType } from "@components/types";
import { copyClipboard } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { track } from "@lib/mixpanel";

interface CodeBlockProps {
  children: string;
  event?: Record<string, any>;
}

const CodeBlock: FunctionComponent<CodeBlockProps> = ({ children, event }) => {
  const { t } = useTranslation();
  hljs.registerLanguage("python", python);
  //   hljs.registerLanguage("julia", julia);
  //   hljs.registerLanguage("r", r);
  const languageOptions: OptionType[] = [
    {
      label: "Python",
      value: "python",
    },
    // Disabled until further notice
    // {
    //   label: "Julia",
    //   value: "julia",
    // },
    // {
    //   label: "R",
    //   value: "r",
    // },
  ];
  const [language, setLanguage] = useState<OptionType>(languageOptions[0]);
  const [copyText, setCopyText] = useState<string>(t("common.copy"));

  //   const template = useMemo<Record<string, string>>(
  //     () => ({
  //       python: `# ${t("catalogue.code_note")}: pip install pandas fastparquet

  // import pandas as pd

  // URL_DATA = '${url}'

  // df = pd.read_parquet(URL_DATA)
  // if 'date' in df.columns: df['date'] = pd.to_datetime(df['date'])

  // print(df)
  // `,
  //       //       julia: `# Note: Don’t forget to activate your venv
  //       // # If not already installed, do: pip install pandas tabulate

  //       // import pandas as pd
  //       // import json
  //       // from tabulate import tabulate
  //       // import pydosm

  //       // URL_DATA = '${url}'
  //       // URL_METADATA = '${url.replace(".parquet", "_metadata.json")}'

  //       // df_meta = json.loads(URL_METADATA)
  //       // df = pd.read_parquet(URL_DATA)

  //       // print(df_meta)
  //       // `,
  //       //       r: `# Note: Don’t forget to activate your venv
  //       // # If not already installed, do: pip install pandas tabulate

  //       // import pandas as pd
  //       // import json
  //       // from tabulate import tabulate
  //       // import pydosm

  //       // URL_DATA = '${url}'
  //       // URL_METADATA = '${url.replace(".parquet", "_metadata.json")}'

  //       // df_meta = json.loads(URL_METADATA)
  //       // df = pd.read_parquet(URL_DATA)

  //       // print(df_meta)`,
  //     }),
  //     [language]
  //   );

  const handleCopy = () => {
    track("code_copy", { language: language.value, ...event });
    copyClipboard(children);
    setCopyText(t("common.copied"));
    setTimeout(() => {
      setCopyText(t("common.copy"));
    }, 1000);
  };
  return (
    <div className="rounded-xl bg-black ">
      <div className="flex justify-between border-b border-outline border-opacity-20 p-2.5 text-white">
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
          className="text-sm text-dim hover:bg-washed/10"
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
