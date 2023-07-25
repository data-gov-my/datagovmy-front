import { FunctionComponent, ReactNode, useContext, useMemo } from "react";
import Container from "@components/Container";
import { clx, numFormat, toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "next-i18next";
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
  background?: string;
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

  return (
    <Container
      background={clx(background, "border-b dark:border-washed-dark")}
      className={clx("relative", className)}
    >
      {children ? (
        children
      ) : (
        <div>
          {agencyBadge && (
            <div className="sticky inset-x-0 top-14 z-20 -ml-3 flex md:hidden">{agencyBadge}</div>
          )}
          <div className="space-y-6 py-12 xl:w-full">
            {(category || agencyBadge) && (
              <div className="relative flex justify-between">
                <div className="hidden md:absolute md:right-0 md:top-0 md:block">{agencyBadge}</div>
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

            {(header || description) && (
              <div className="space-y-3">
                {header && (
                  <h2 className={clx("text-black", header[1])} data-testid="hero-header">
                    {header[0]}
                  </h2>
                )}

                {description && Array.isArray(description) ? (
                  <p
                    className={clx("text-dim xl:w-2/3", description[1])}
                    data-testid="hero-description"
                  >
                    {description[0]}
                  </p>
                ) : (
                  description
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
