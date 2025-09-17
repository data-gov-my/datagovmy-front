import { At, Button, Container, Hero } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { clx } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import { ForwardRefExoticComponent, FunctionComponent, ReactNode, SVGProps } from "react";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/20/solid";

/**
 * GUI DC Layout
 * @overview Status: Live
 */

interface GUIDCLayoutProps {
  children: ReactNode;
  currentIndex: number;
  header: string;
  steps: { icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>; name: string; desc: string }[];
}

const GUIDCLayout: FunctionComponent<GUIDCLayoutProps> = ({
  children,
  currentIndex,
  header,
  steps,
}) => {
  const { t } = useTranslation(["gui-data-catalogue", "common"]);

  return (
    <div className="flex h-full w-full flex-1 justify-center">
      <div className="divide-outline md:px-4.5 flex max-w-screen-2xl flex-1 divide-x px-3 max-lg:gap-6 max-lg:py-6 lg:px-6">
        <div className="flex w-full max-w-[284px] flex-col items-center gap-3 lg:w-2/5 lg:gap-8 lg:py-12 lg:pr-6 xl:w-1/3">
          <h3 className="font-body lg:font-header text-balance font-bold max-lg:text-base">
            {t("create_new")}
          </h3>

          <div className="bg-washed dark:bg-washed-dark flex w-fit items-center gap-y-1 rounded-lg px-3 py-1 text-sm lg:hidden">
            {steps.map((step, i) => (
              <>
                <div
                  className={clx(
                    i === currentIndex
                      ? "text-primary dark:text-primary-dark"
                      : "text-black dark:text-white"
                  )}
                >
                  {step.name}
                </div>
                {i < steps.length - 1 && (
                  <ChevronRightIcon className="text-outlineHover dark:text-outlineHover-dark size-6" />
                )}
              </>
            ))}
          </div>

          <div className="hidden w-full flex-col gap-y-2 lg:flex">
            {steps.map((step, i) => (
              <div
                key={i}
                className={clx(
                  "flex h-full gap-4",
                  i === currentIndex
                    ? "text-primary dark:text-primary-dark"
                    : "text-black dark:text-white",
                  i > currentIndex && "opacity-40"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="border-outline dark:border-washed-dark size-12 rounded-lg border p-2.5">
                    <step.icon className="size-7" />
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={clx(
                        "max-h-full w-0.5 grow rounded bg-black",
                        i >= currentIndex && "bg-outline"
                      )}
                    />
                  )}
                </div>
                <div className="flex h-full flex-col gap-0.5">
                  <p className="font-bold">{step.name}</p>
                  <p className="text-dim pb-6 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default GUIDCLayout;
