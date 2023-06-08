import { toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode, forwardRef, LegacyRef, ForwardedRef, useMemo } from "react";
import { DateTime } from "luxon";
interface SectionProps {
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  menu?: ReactNode;
  date?: string | number | null;
  ref?: ForwardedRef<HTMLElement> | undefined;
}

const Section: FunctionComponent<SectionProps> = forwardRef(
  (
    { title, className = "border-b py-12", description, children, date, menu },
    ref: LegacyRef<HTMLElement> | undefined
  ) => {
    const { t } = useTranslation();
    const router = useRouter();

    const displayDate = useMemo((): string => {
      if (date === undefined || date === null) return "";

      if (typeof date === "string") {
        if (DateTime.fromSQL(date).isValid && date.length > 4)
          return toDate(date, "dd MMM yyyy, HH:mm", router.locale);
        else return date;
      }
      return toDate(date, "dd MMM yyyy, HH:mm", router.locale);
    }, [date]);
    return (
      <section className={className} ref={ref}>
        <div className="pb-2 lg:pb-4">
          <div className="flex flex-col items-start gap-2 pb-4 lg:flex-row lg:items-center lg:justify-between">
            {title && typeof title === "string" ? <h4>{title}</h4> : title}
            {date && date !== null && (
              <span className="text-right text-sm text-dim">
                {t("common.data_of", { date: displayDate })}
              </span>
            )}
          </div>
          {(description || menu) && (
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 md:flex-nowrap">
              {description && typeof description === "string" ? (
                <p className="whitespace-pre-line text-base text-dim">{description}</p>
              ) : (
                description
              )}
              {menu && <div className="flex gap-3">{menu}</div>}
            </div>
          )}
        </div>
        {children}
      </section>
    );
  }
);

export default Section;
