import { FunctionComponent, useEffect, useRef, useState, useContext } from "react";
import { Catalogue } from "../../../types/data-catalogue";
import { At, Card, Tooltip } from "datagovmy-ui/components";
import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { clx, toDate, numFormat } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { DownloadOption } from "../../../types";
import Image from "next/image";
import { AnalyticsContext } from "../../contexts/analytics";

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
        "border-outline hover:border-outlineHover hover:bg-background dark:hover:bg-washed-dark/50 dark:border-washed-dark dark:hover:border-outlineHover-dark group relative rounded-xl bg-white transition-colors dark:bg-black",
        width ? width : "w-full"
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
            <Tooltip tip={dataset.title}>
              {() => (
                <p
                  ref={titleRef}
                  className="truncate text-lg font-bold text-black dark:text-white"
                  title={dataset.title}
                >
                  {dataset.title}
                </p>
              )}
            </Tooltip>
          ) : (
            <p
              ref={titleRef}
              className="truncate text-lg font-bold text-black dark:text-white"
              title={dataset.title}
            >
              {dataset.title}
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

interface DownloadCard extends DownloadOption {
  views?: number;
  catalogueId: string;
  link_editions?: string[];
  baseUrl?: string;
}

export const DownloadCard: FunctionComponent<DownloadCard> = ({
  href,
  image,
  title,
  description,
  icon,
  id,
  views,
  catalogueId,
  link_editions,
  baseUrl,
}) => {
  const { send_new_analytics } = useContext(AnalyticsContext);
  const handleClick = () => {
    send_new_analytics(catalogueId, "data-catalogue", "file_download", {
      format: id,
    });

    let url: string | undefined;

    if (baseUrl && link_editions && link_editions.length > 0) {
      const latestEdition = link_editions[0];
      url = baseUrl.replace("YYYY-MM-DD", latestEdition);
    } else if (typeof href === "function") {
      const result = href();
      if (typeof result === "string") {
        url = result;
      } else {
        return;
      }
    } else if (typeof href === "string") {
      url = href;
    }

    if (url) {
      window.open(url, "_blank");
    } else {
      console.error("No valid URL found for download");
    }
  };

  return (
    <Card
      onClick={handleClick}
      className="bg-background p-4.5 dark:border-outlineHover-dark dark:bg-washed-dark"
    >
      <div className="gap-4.5 flex items-center">
        {["svg", "png"].includes(id) ? (
          <Image
            src={image || ""}
            className="dark:border-dim aspect-video h-14 rounded border bg-white object-cover dark:bg-black lg:h-16"
            width={128}
            height={64}
            alt={title as string}
          />
        ) : (
          <Image
            height={64}
            width={64}
            src={image || ""}
            className="object-contain"
            alt={title as string}
          />
        )}
        <div className="block flex-grow">
          <p className="font-bold">{title}</p>
          {description && <p className="text-dim text-sm">{description}</p>}
        </div>

        <div className="space-y-1">
          {icon}
          <p className="text-dim text-center text-xs">{numFormat(views ?? 0, "compact")}</p>
        </div>
      </div>
    </Card>
  );
};
