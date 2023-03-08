import { FunctionComponent, ReactNode } from "react";
import Container from "@components/Container";
import { toDate } from "@lib/helpers";
import { useTranslation } from "next-i18next";

type ConditionalHeroProps =
  | {
      children?: ReactNode;
      last_updated?: never;
      header?: never;
      category?: never;
      description?: never;
    }
  | HeroDefault;

type HeroDefault = {
  children?: never;
  last_updated?: string | number;
  header?: [string, string?]; // [text, className]
  category?: [string, string?]; // [text, className]
  description?: [string, string?] | ReactNode;
};

type HeroProps = {
  background?: string;
  className?: string;
} & ConditionalHeroProps;

const Hero: FunctionComponent<HeroProps> = ({
  background = "bg-washed",
  className,
  children,
  category,
  header,
  description,
  last_updated,
}) => {
  const { t, i18n } = useTranslation();
  return (
    <Container background={background} className={`py-12 ${className}`}>
      {children ? (
        children
      ) : (
        <div className="space-y-6 xl:w-2/3">
          {category && (
            <span
              className={["text-sm font-bold uppercase tracking-widest", category[1] ?? ""].join(
                " "
              )}
            >
              {category[0]}
            </span>
          )}

          {(header || description) && (
            <div className="space-y-3">
              {header && <h3 className={["text-black", header[1] ?? ""].join(" ")}>{header[0]}</h3>}
              {description && Array.isArray(description) ? (
                <p className={["text-dim", description[1]].join(" ")}>{description[0]}</p>
              ) : (
                description
              )}
            </div>
          )}

          {last_updated && (
            <p className="text-sm text-dim dark:text-white">
              {t("common.last_updated", {
                date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
              })}
            </p>
          )}
        </div>
      )}
    </Container>
  );
};

export default Hero;
