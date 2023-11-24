import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { Button } from "datagovmy-ui/components";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { DateTime } from "luxon";
import { FunctionComponent } from "react";

export type Publication = {
  description: string;
  publication_id: string;
  publication_type: string;
  release_date: string;
  title: string;
  total_downloads: number;
};

interface PublicationCardProps {
  onClick: () => void;
  publication: Publication;
}

const PublicationCard: FunctionComponent<PublicationCardProps> = ({ onClick, publication }) => {
  const { t, i18n } = useTranslation(["publications", "common"]);
  const diffInDays = DateTime.now().diff(DateTime.fromISO(publication.release_date), ["days"]);

  return (
    <Button
      variant="reset"
      key={publication.publication_id}
      className="hover:border-outlineHover hover:bg-background dark:border-washed-dark dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50 group flex w-full flex-col space-y-3 rounded-xl border p-6 transition"
      onClick={onClick}
    >
      <div className="relative flex w-full items-center justify-between">
        <p className="text-dim text-sm font-medium uppercase">
          {toDate(publication.release_date, "dd MMM yyyy", i18n.language)}
        </p>
        {/* If release date is within 1 week from today */}
        {diffInDays.days < 8 && (
          <div className="bg-danger flex items-center gap-1.5 rounded-full px-1.5 py-0.5 text-xs text-white transition-transform group-hover:-translate-x-7 group-hover:duration-300">
            <span className="h-2 w-2 rounded-full bg-white" />
            {t("new")}!
          </div>
        )}
        <ArrowUpRightIcon className="text-dim absolute right-2 h-5 w-5 opacity-0 transition-[opacity_transform] duration-0 group-hover:translate-x-2 group-hover:opacity-100 group-hover:duration-300" />
      </div>

      <div className="flex grow flex-col gap-3 overflow-hidden text-start">
        <div className="grow flex-wrap space-y-3">
          <p className="text-lg font-bold">{publication.title}</p>
          <p className="text-dim text-sm font-normal">{publication.description}</p>
        </div>
        <div className="relative w-full text-base font-normal">
          {/* TODO: View counts (add back when ready) */}
          <p className="text-dim transition-transform group-hover:translate-y-6">
            {numFormat(publication.total_downloads, "compact")}{" "}
            {t("common:common.downloads", {
              count: publication.total_downloads,
            })}
          </p>
          <p className="text-primary dark:text-primary-dark absolute -bottom-6 whitespace-nowrap transition-transform group-hover:-translate-y-6 group-hover:duration-300">
            {t("common:components.click_to_explore")}
          </p>
        </div>
      </div>
    </Button>
  );
};

export default PublicationCard;
