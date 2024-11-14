import { At, Button, Container } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { clx } from "datagovmy-ui/helpers";
import { ForwardRefExoticComponent, FC, ReactNode, SVGProps } from "react";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { routes } from "@lib/routes";

/**
 * Publication Subscription Layout
 * @overview Status: Live
 */

interface PublicationSubscriptionLayoutProps {
  children: ReactNode;
  currentIndex: number;
  header: string;
  steps: { icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>; name: string; desc: string }[];
}

const PublicationSubscriptionLayout: FC<PublicationSubscriptionLayoutProps> = ({
  children,
  currentIndex,
  header,
  steps,
}) => {
  const { t } = useTranslation("publication-subscription");

  return (
    <Container className="flex min-h-dvh flex-col divide-outline max-lg:gap-6 max-lg:divide-none max-lg:py-6 lg:max-h-dvh lg:flex-row lg:divide-x">
      <div className="flex w-full flex-col gap-3 lg:w-2/5 lg:gap-14 lg:p-20 xl:w-1/3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-balance font-body text-base font-bold lg:font-header lg:text-xl">
            {header}
          </h1>
          <At className="lg:hidden" href={routes.PUBLICATIONS}>
            <Button className="p-0">
              <XMarkIcon className="size-6 text-dim" />
            </Button>
          </At>
        </div>

        <div className="flex w-fit items-center gap-y-1 rounded-lg bg-washed px-3 py-1 text-sm dark:bg-washed-dark lg:hidden">
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
                <ChevronRightIcon className="size-6 text-outlineHover dark:text-outlineHover-dark" />
              )}
            </>
          ))}
        </div>

        <div className="hidden flex-col gap-y-2 lg:flex">
          {steps.map((step, i) => (
            <div
              className={clx(
                "flex h-full gap-4",
                i === currentIndex
                  ? "text-primary dark:text-primary-dark"
                  : "text-black dark:text-white",
                i > currentIndex && "opacity-40"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="size-12 rounded-lg border border-outline p-2.5 dark:border-washed-dark">
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
                <p className="pb-6 text-sm text-dim">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <At className="hidden w-fit lg:block" href={routes.PUBLICATIONS}>
          <Button variant="default">{t("cancel")}</Button>
        </At>
      </div>

      {children}
    </Container>
  );
};

export default PublicationSubscriptionLayout;
