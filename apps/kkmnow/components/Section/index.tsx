import { DateTime } from "luxon";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FunctionComponent, ReactElement, ReactNode } from "react";

interface SectionProps {
  className?: string;
  title?: string | ReactElement;
  description?: string | ReactElement;
  children?: ReactNode;
  date?: string | null;
}

const Section: FunctionComponent<SectionProps> = ({
  title,
  className = "border-b py-12",
  description,
  children,
  date,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const displayDate = (): string => {
    if (date === undefined && date === null) return "";
    return (
      DateTime.fromSQL(date!)
        .setLocale(router.locale ?? router.defaultLocale!)
        .toFormat("dd MMM yyyy, HH:mm") ?? date
    );
  };
  return (
    <section className={className}>
      <div className="pb-6">
        <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-between">
          {title && typeof title === "string" ? <h4>{title}</h4> : title}
          {date && date !== null && (
            <span className="text-right text-sm text-dim">
              {t("common.data_of", { date: displayDate() })}
            </span>
          )}
        </div>
        {description && typeof description === "string" ? (
          <p className="pt-4 text-base text-dim">{description}</p>
        ) : (
          description
        )}
      </div>
      {children}
    </section>
  );
};

export default Section;
