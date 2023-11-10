import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";
import Image from "next/image";
import { toDate } from "datagovmy-ui/helpers";
import { DateTime } from "luxon";
import { CommunityProductsItem } from "pages/community-products/[[...product_id]]";

interface CommunityProductsCardProps {
  item: CommunityProductsItem;
  onClick: () => void;
}

const CommunityProductsCard: FunctionComponent<CommunityProductsCardProps> = ({
  item,
  onClick,
}) => {
  const { t, i18n } = useTranslation(["community-products"]);
  const diffInDays = DateTime.now().diff(DateTime.fromISO(item.date), ["days"]);

  return (
    <div className="gap-4.5 flex w-full hover:cursor-pointer" key={item.id} onClick={onClick}>
      <div className="bg-background border-outline flex h-[150px] w-[150px] items-center rounded-lg border">
        <Image src={item.image} width={150} height={150} alt={item.title} />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        {diffInDays.days < 14 && <p className="text-primary text-sm font-medium">{t("new")}</p>}
        <p className="text-base font-bold">{item.title}</p>
        <div className="text-dim flex items-center gap-2 text-sm font-medium">
          <p className="capitalize">{item.type}</p>
          <div className="bg-dim h-2 w-2 rounded-full" />
          <p> {toDate(item.date, "dd MMM yyyy", i18n.language)}</p>
        </div>

        <p className="text-dim mt-1.5 line-clamp-2 w-full text-sm">{item.description}</p>
      </div>
    </div>
  );
};

export default CommunityProductsCard;
