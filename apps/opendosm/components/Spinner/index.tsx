import { FunctionComponent } from "react";

interface SpinnerProps {
  loading: boolean;
  className?: string;
}

const Spinner: FunctionComponent<SpinnerProps> = ({ loading, className }) => {
  return loading ? (
    <div
      className={[
        "h-4 w-4 animate-spin rounded-[50%] border-2 border-gray-300 border-t-black",
        className,
      ].join(" ")}
    />
  ) : (
    <></>
  );
};

export default Spinner;
