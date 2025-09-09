import { FunctionComponent } from "react";
import Container from "../Container";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { clx } from "../../lib/helpers";

interface BannerProps {
  text: string;
  className?: string;
}

const Banner: FunctionComponent<BannerProps> = ({ text, className }) => {
  return (
    <div className={clx("mt-14 w-full bg-primary text-white", className)}>
      <Container>
        <div className="flex max-w-screen-2xl gap-2 py-4">
          <InformationCircleIcon className="size-5 shrink-0" />
          <p className={clx("[&>a]:text-white [&>a]:underline text-sm")}>{text}</p>
        </div>
      </Container>
    </div>
  );
};

export default Banner;
