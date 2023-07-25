import { useTranslation } from "next-i18next";
import { FunctionComponent } from "react";

interface ErrorProps {
  title: string;
  description?: string;
  code: number;
  reason: string;
}

const Error: FunctionComponent<ErrorProps> = ({ title, description, code, reason }) => {
  const { t } = useTranslation("common");
  return (
    <>
      <div className="flex flex-col space-y-10">
        <div className="flex flex-col-reverse  items-end justify-between gap-6 lg:flex-row">
          <div>
            <h2 className="text-xl lg:text-3xl">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <h1 className="text-7xl font-black text-dim opacity-50">{code}</h1>
        </div>
        <div>
          <p className=" pb-2 text-sm font-bold uppercase text-dim">{t("error.output")}</p>
          <code className="block min-h-[200px] w-full rounded bg-outline p-4">
            <span className="font-bold text-green-600">~/kkmnow $</span> cat {code}-error.log
            <br />
            {reason}
            <br />
            <span className="font-bold text-green-600">~/kkmnow $</span>
          </code>
          <small className="text-xs">
            <i>{t("error.disclaimer")}</i>
          </small>
        </div>
      </div>
    </>
  );
};

export default Error;
