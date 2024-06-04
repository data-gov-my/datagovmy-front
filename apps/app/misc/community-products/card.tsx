import { useTranslation } from "datagovmy-ui/hooks";
import { FunctionComponent } from "react";
import Image from "next/image";
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
  const { t } = useTranslation(["community-products"]);
  const diffInDays = DateTime.now().diff(DateTime.fromISO(item.date_approved), ["days"]);

  return (
    <div
      className="gap-4.5 hover:bg-washed dark:hover:bg-washed-dark flex w-full rounded-md hover:cursor-pointer"
      key={item.id}
      onClick={onClick}
    >
      <div className="bg-background dark:bg-washed-dark border-outline dark:border-outlineHover-dark relative flex h-[150px] w-[150px] items-center overflow-hidden rounded-lg border">
        <Image
          src={item.thumbnail || "/static/images/og_en-GB.png"}
          width={150}
          height={150}
          alt={item.product_name}
        />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        {diffInDays.days < 14 && <p className="text-primary text-sm font-medium">{t("new")}</p>}
        <p className="text-base font-bold">{item.product_name}</p>
        <div className="text-dim flex items-center gap-2 text-sm font-medium">
          <p className="capitalize">{t(`product_type.${item.product_type}`)}</p>
          <div className="bg-dim h-1 w-1 rounded-full" />
          <p> {DateTime.fromFormat(item.product_year.toString(), "yyyy").toFormat("yyyy")}</p>
        </div>

        <p className="text-dim mt-1.5 line-clamp-2 w-full text-sm">{item.product_description}</p>
      </div>
    </div>
  );
};

export default CommunityProductsCard;
