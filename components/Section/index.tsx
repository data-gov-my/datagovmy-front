import { toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
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
    const { t, i18n } = useTranslation();

    const displayDate = useMemo((): string => {
      if (date === undefined || date === null) return "";

      if (typeof date === "string") {
        if (DateTime.fromSQL(date).isValid && date.length > 4)
          return toDate(date, "dd MMM yyyy, HH:mm", i18n.language);
        else return date;
      }
      return toDate(date, "dd MMM yyyy, HH:mm", i18n.language);
    }, [date]);
    return (
      <section className={className} ref={ref}>
        <div className="space-y-2">
          <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-between">
            {title && typeof title === "string" ? <h4>{title}</h4> : title}
            {date && date !== null && (
              <span className="text-right text-sm text-dim">
                {t("common.data_of", { date: displayDate })}
              </span>
            )}
          </div>
          {(description || menu) && (
            <div className="flex flex-wrap gap-x-6 gap-y-3 md:flex-nowrap md:items-end md:justify-between">
              {description && typeof description === "string" ? (
                <p
                  className={[
                    "whitespace-pre-line text-base text-dim",
                    menu ? "md:max-w-[70%]" : "",
                  ].join(" ")}
                >
                  {description}
                </p>
              ) : (
                description
              )}
              {menu && <div className="flex w-full justify-end gap-3 md:w-auto">{menu}</div>}
            </div>
          )}
        </div>
        <div className="pt-6">{children}</div>
      </section>
    );
  }
);

export default Section;
