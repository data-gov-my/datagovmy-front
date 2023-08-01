// import Dropdown from "@components/Dropdown";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import "highlight.js/styles/shades-of-purple.css";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";

interface ErrorProps {
  title: string;
  description?: string | null;
  code: number;
  reason: string;
}

const Error: FunctionComponent<ErrorProps> = ({ title, description, code, reason }) => {
  const { t } = useTranslation("common");
  return (
    <>
      <div className="flex flex-col space-y-10">
        <div className="flex flex-col-reverse  items-end justify-between gap-6 lg:flex-row">
          <div className="space-y-2">
            <h2 className="text-xl lg:text-3xl">{title}</h2>
            <p>{description && <p>{description}</p>}</p>
          </div>
          <h1 className="text-dim text-7xl font-black opacity-50">{code}</h1>
        </div>
        <div>
          <p className=" text-dim pb-2 text-sm font-bold uppercase">{t("common:error.output")}</p>

          <div className="rounded-xl bg-black ">
            <div className="p-4.5 font-mono text-sm text-white">
              <span className="font-bold text-green-600">data.gov.my:~/ $</span> cat {code}
              -error.log
              <br />
              {reason}
              <br />
              <span className="font-bold text-green-600">data.gov.my:~/ $</span>
            </div>
          </div>

          <small className="text-xs">
            <i>{t("common:error.disclaimer")}</i>
          </small>
        </div>
      </div>
    </>
  );
};

export default Error;
