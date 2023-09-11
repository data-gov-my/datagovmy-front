import { FunctionComponent, ReactNode, useContext, useMemo } from "react";
import Container from "../../components/Container";
import { clx, numFormat, toDate } from "../../lib/helpers";
import { Trans, useTranslation } from "next-i18next";
import { AnalyticsContext } from "../../contexts/analytics";
import { EyeIcon } from "@heroicons/react/20/solid";

type ConditionalHeroProps =
  | {
      children?: ReactNode;
      last_updated?: never;
      header?: never;
      category?: never;
      description?: never;
      action?: never;
      agencyBadge?: never;
    }
  | HeroDefault;

type HeroDefault = {
  children?: never;
  last_updated?: string | number;
  header?: [text: string, className?: string];
  category?: [text: string, className?: string];
  description?: [text: string, className?: string] | ReactNode;
  action?: ReactNode;
  agencyBadge?: ReactNode;
};

type HeroProps = {
  background?: "gray" | "blue" | "red" | "purple" | "green" | "orange" | string;
  className?: string;
} & ConditionalHeroProps;

const Hero: FunctionComponent<HeroProps> = ({
  background = "gray",
  className,
  children,
  category,
  header,
  description,
  action,
  last_updated,
  agencyBadge,
}) => {
  const { t, i18n } = useTranslation();
  const { result } = useContext(AnalyticsContext);

  const background_style = useMemo<string>(() => {
    switch (background) {
      case "blue":
        return "bg-gradient-radial from-[#A1BFFF] to-background dark:from-[#203053] dark:to-black";
      case "red":
        return "bg-gradient-radial from-[#FFE1E1] to-background dark:from-[#492424] dark:to-black";
      case "purple":
        return "bg-gradient-radial from-[#C4B5FD] to-background dark:from-[#281843] dark:to-black";
      case "green":
        return "bg-gradient-radial from-[#CFFCCC] to-background dark:from-[#1B2C1A] dark:to-black";
      case "orange":
        return "bg-gradient-radial from-[#FFE5CD] to-background dark:from-[#2E2014] dark:to-black";
      case "gray":
        return "bg-gradient-radial from-[#E2E8F0] to-background dark:from-[#3F3F46] dark:to-black";
      default:
        return background;
    }
  }, [background]);

  return (
    <Container
      background={clx(background_style, "border-b dark:border-washed-dark")}
      className={clx("relative", className)}
    >
      {children ? (
        children
      ) : (
        <div>
          {agencyBadge && (
            <div className="md:max-lg:-ml-4.5 sticky inset-x-0 top-14 z-20 -ml-3 flex lg:hidden">
              {agencyBadge}
            </div>
          )}
          <div className="space-y-6 py-12 xl:w-full">
            {(category || agencyBadge) && (
              <div className="relative flex justify-between">
                <div className="hidden lg:absolute lg:right-0 lg:top-0 lg:block">{agencyBadge}</div>
                {category && (
                  <span
                    className={clx("text-base font-semibold uppercase", category[1])}
                    data-testid="hero-category"
                  >
                    {t(category[0])}
                  </span>
                )}
              </div>
            )}

            {(header || description || result?.view_count) && (
              <div className="space-y-3">
                {header && (
                  <h2 className={clx("text-black", header[1])} data-testid="hero-header">
                    {header[0]}
                  </h2>
                )}

                {description && Array.isArray(description) ? (
                  <p
                    className={clx("text-dim max-xl:max-w-prose xl:w-2/3", description[1])}
                    data-testid="hero-description"
                  >
                    <Trans>{description[0]}</Trans>
                  </p>
                ) : (
                  description
                )}
                {result?.view_count && (
                  <p className="text-dim flex gap-2 text-sm" data-testid="hero-views">
                    <EyeIcon className="w-4.5 h-4.5 self-center" />
                    {`${numFormat(result.view_count, "standard")} ${t("common:common.views", {
                      count: result.view_count,
                    })}`}
                  </p>
                )}
              </div>
            )}

            {(action || last_updated) && (
              <div className="space-y-3">
                {action}
                {last_updated && (
                  <p className="text-dim text-sm" data-testid="hero-last-updated">
                    {t("common:common.last_updated", {
                      date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default Hero;
