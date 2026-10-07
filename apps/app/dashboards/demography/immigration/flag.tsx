import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { ImageWithFallback } from "datagovmy-ui/components";
import { FunctionComponent } from "react";

const Flag: FunctionComponent<{ country: string }> = ({ country }) => (
  <div className="flex h-auto max-h-8 w-7 shrink-0 justify-center self-center">
    <ImageWithFallback
      className="border-outline dark:border-outlineHover-dark rounded border"
      src={`https://flagcdn.com/h40/${country.toLowerCase()}.png`}
      fallback={<GlobeAltIcon className="w-4.5 h-4.5 text-dim mx-auto" />}
      width={28}
      height={18}
      alt={country}
      style={{ width: "auto", maxWidth: "28px", height: "auto", maxHeight: "28px" }}
    />
  </div>
);

export default Flag;
