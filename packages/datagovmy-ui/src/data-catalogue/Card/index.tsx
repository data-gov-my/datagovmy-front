import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Catalogue } from "../Main";
import { At, Card, Tooltip } from "datagovmy-ui/components";
import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";

interface CatalogueCardProps {
  dataset: Catalogue;
  index: number;
  alternateStyle?: boolean;
  width?: string;
}

const CatalogueCard: FunctionComponent<CatalogueCardProps> = ({
  dataset,
  index,
  alternateStyle = false,
  width,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const titleRef = useRef<HTMLParagraphElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const isEllipsisActive = (e: HTMLElement | null) => {
    if (e) {
      return e.offsetWidth < e.scrollWidth;
    }
    return false;
  };

  useEffect(() => {
    if (titleRef.current) {
      setIsTruncated(isEllipsisActive(titleRef.current));
    }
  }, [titleRef.current]);

  return (
    <Card
      key={index}
      className={clx(
        "border-outline hover:border-outlineHover hover:bg-background dark:hover:bg-washed-dark/50 dark:border-washed-dark dark:hover:border-outlineHover-dark group relative rounded-xl transition-colors",
        width ? width : "w-full md:w-[calc(100%_/_2-24px)] "
      )}
    >
      <At
        href={`/data-catalogue/${dataset.id}`}
        locale={i18n.language}
        prefetch={false}
        className="py-4.5 flex flex-col gap-4 px-5"
      >
        <div className="flex flex-col gap-1.5">
          {isTruncated && !alternateStyle ? (
            <Tooltip tip={dataset.catalog_name}>
              {() => (
                <p
                  ref={titleRef}
                  className="truncate text-lg font-bold text-black dark:text-white"
                  title={dataset.catalog_name}
                >
                  {dataset.catalog_name}
                </p>
              )}
            </Tooltip>
          ) : (
            <p
              ref={titleRef}
              className="truncate text-lg font-bold text-black dark:text-white"
              title={dataset.catalog_name}
            >
              {dataset.catalog_name}
            </p>
          )}

          <p className={clx("text-sm", alternateStyle ? "line-clamp-2" : "truncate")}>
            {dataset.description}
          </p>
        </div>
        {alternateStyle ? null : (
          <div className="flex flex-row items-center gap-1">
            <BuildingLibraryIcon className="text-dim h-4 w-4" />
            <p className="text-dim text-sm font-medium">
              {dataset.data_source?.length ? dataset.data_source[0] : ""}
            </p>
            <div className="bg-dim h-1 w-1 rounded-full px-0.5" />
            <p className="text-dim text-sm">
              {t("common:common.data_of", {
                date: toDate(
                  dataset.data_as_of ? dataset.data_as_of : new Date().toISOString(),
                  "dd MMM yyyy, HH:mm",
                  i18n.language
                ),
              })}
            </p>
          </div>
        )}
      </At>
    </Card>
  );
};

export default CatalogueCard;
