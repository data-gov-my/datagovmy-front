import { FunctionComponent } from "react";
import { clx } from "../../lib/helpers";

interface SpinnerProps {
  loading: boolean;
  className?: string;
}

const Spinner: FunctionComponent<SpinnerProps> = ({ loading, className }) => {
  return loading ? (
    <div
      className={clx(
        "h-4 w-4 animate-spin rounded-[50%] border-2 border-gray-300 border-t-black",
        className
      )}
    />
  ) : (
    <></>
  );
};

export default Spinner;
