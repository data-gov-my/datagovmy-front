import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { Button } from "datagovmy-ui/components";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { Publication } from "misc/publications/browse";
import { FunctionComponent } from "react";

interface PublicationCardProps {
  onClick: () => void;
  publication: Publication;
}

const PublicationCard: FunctionComponent<PublicationCardProps> = ({ onClick, publication }) => {
  const { t, i18n } = useTranslation(["publications", "common"]);

  return (
    <Button
      variant="reset"
      key={publication.publication_id}
      className="group flex w-full flex-col space-y-3 rounded-xl border p-6 transition hover:border-outlineHover hover:bg-background dark:border-washed-dark dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
      onClick={onClick}
    >
      <div className="relative flex w-full items-center justify-between">
        <p className="text-sm font-medium uppercase text-dim">
          {toDate(publication.release_date, "dd MMM yyyy", i18n.language)}
        </p>
        {/* If release date is less than 14 days from today */}
        {Date.now() - Date.parse(publication.release_date) < 1180200000 && (
          <div className="flex items-center gap-1.5 rounded-full bg-danger px-1.5 py-0.5 text-xs text-white transition-transform group-hover:-translate-x-7 group-hover:duration-300">
            <span className="h-2 w-2 rounded-full bg-white" />
            {t("new")}!
          </div>
        )}
        <ArrowUpRightIcon className="absolute right-2 h-5 w-5 text-dim opacity-0 transition-[opacity_transform] duration-0 group-hover:translate-x-2 group-hover:opacity-100 group-hover:duration-300" />
      </div>

      <div className="flex grow flex-col gap-3 overflow-hidden text-start">
        <div className="grow flex-wrap space-y-3">
          <p className="text-lg font-bold">{publication.title}</p>
          <p className="text-sm font-normal text-dim">{publication.description}</p>
        </div>
        <div className="relative w-full text-base font-normal">
          {/* TODO: View counts (add back when ready) */}
          <p className="text-dim transition-transform group-hover:translate-y-6">
            {numFormat(publication.total_downloads, "compact")}{" "}
            {t("common:common.downloads", {
              count: publication.total_downloads,
            })}
          </p>
          <p className="absolute -bottom-6 whitespace-nowrap text-primary transition-transform group-hover:-translate-y-6 group-hover:duration-300 dark:text-primary-dark">
            {t("common:components.click_to_explore")}
          </p>
        </div>
      </div>
    </Button>
  );
};

export default PublicationCard;
