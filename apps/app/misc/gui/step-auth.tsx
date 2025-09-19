import { Spinner } from "datagovmy-ui/components";
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "datagovmy-ui/hooks";
import { useSession } from "next-auth/react";

interface StepAuthProps {
  setIndex: Dispatch<SetStateAction<number>>;
}

const StepAuth: FunctionComponent<StepAuthProps> = ({ setIndex }) => {
  const { t } = useTranslation(["gui-data-catalogue", "common"]);

  const session = useSession();
  const authenticated = session.status === "authenticated";
  const loading = session.status === "loading";

  useEffect(() => {
    if (authenticated) {
      const timer = setTimeout(() => {
        setIndex(1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [authenticated, setIndex]);

  return (
    <div className="flex w-full items-center justify-center">
      {loading ? (
        <Spinner className="border-t-primary" loading={loading} />
      ) : authenticated ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <CheckCircleIcon className="size-10 text-green-500" />
          <p>{t("step_auth.github_authenticated")}</p>
        </div>
      ) : null}
    </div>
  );
};

export default StepAuth;
