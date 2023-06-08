import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";

interface JitterplotOverlayProps {
  areaType: "district" | "dun" | "state" | "parlimen";
}

const JitterplotOverlay: FunctionComponent<JitterplotOverlayProps> = ({ areaType = "state" }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="pointer-events-none absolute top-0 left-0 flex h-full w-full">
        <div className="h-full w-0 lg:w-1/5" />
        <div className="flex w-full flex-col lg:w-4/5">
          <div className="-mt-20 grid grid-cols-3 items-center justify-items-center pb-4 lg:-mt-12">
            <p className="flex items-center gap-4 text-sm text-dim lg:text-base">
              <ChevronLeftIcon className="h-4 w-4" />
              {t("kawasanku.below_median")}
            </p>
            <p className="text-center text-sm font-medium lg:text-lg">
              {t("kawasanku.median", { type: t(`kawasanku.area_types.${areaType}s`) })}
            </p>
            <p className="flex items-center gap-2 text-end text-sm text-dim lg:text-base">
              {t("kawasanku.above_median")}
              <ChevronRightIcon className="h-4 w-4" />
            </p>
          </div>
          <div className="relative grid h-[110%] w-full grid-cols-13 justify-items-center">
            <div className="absolute top-0 flex w-full items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="z-10 -mt-0.5 h-3 w-3 rotate-180"
                fill="#13293d"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="absolute -ml-0.5 h-full translate-x-1/2 border border-dim" />

            {Array(13)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className={
                    index === 8
                      ? "w-full border-r border-dim/20 bg-dim/5"
                      : index <= 7 && index >= 5
                      ? "w-full bg-dim/5"
                      : index === 4
                      ? "w-full border-l border-dim/20 bg-dim/5"
                      : ""
                  }
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default JitterplotOverlay;
