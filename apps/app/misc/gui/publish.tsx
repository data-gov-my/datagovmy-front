import {
  CheckCircleIcon,
  PlusIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { routes } from "@lib/routes";
import { Button, Spinner } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { signOut } from "next-auth/react";
import { useState } from "react";

const STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

export function usePublishDataCatalogue() {
  const [status, setStatus] = useState<Status | null>(null);

  const reset = () => setStatus(null);

  const publishDataCatalogue = async ({ fileName, data }: { fileName: string; data: string }) => {
    setStatus(STATUS.LOADING);
    try {
      const response = await fetch("/api/data-catalogue/open-pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName, data }),
      });
      if (!response.ok) {
        throw Error("Response was not ok");
      }
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setStatus(STATUS.ERROR);
    }
  };

  return { publishDataCatalogue, status, reset };
}

function CenteredContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-md items-center justify-center p-4">
      {children}
    </div>
  );
}

type PublishDataCatalogueModalProps = {
  status: Status | null;
  onClickCreateAnotherPage: () => void;
  onClickRetry?: () => void;
};
export function PublishDataCatalogueModal({
  status,
  onClickCreateAnotherPage,
  onClickRetry,
}: PublishDataCatalogueModalProps) {
  const { t } = useTranslation("gui-data-catalogue");

  const logout = () => {
    signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}${routes.GUI_CATALOGUE}` });
  };

  if (status === "loading") {
    return (
      <CenteredContainer>
        <div className="flex flex-col items-center gap-4">
          <Spinner loading className="h-20 w-20" />
          <p>{t("loading")}</p>
        </div>
      </CenteredContainer>
    );
  }

  if (status === "error") {
    return (
      <CenteredContainer>
        <div className="flex flex-col items-center gap-6">
          <ExclamationCircleIcon className="text-danger h-16 w-16" />
          <div className="text-center">
            <h2 className="mb-2">{t("publish_error.heading")}</h2>
            <p className="text-dim">{t("publish_error.subheading")}</p>
          </div>
          <div className="flex w-full gap-2">
            <Button
              variant="default"
              className="flex-1 justify-center text-center"
              onClick={() => logout()}
            >
              {t("logout")}
            </Button>
            {onClickRetry && (
              <Button
                variant="primary"
                className="flex-1 justify-center text-center"
                icon={<ArrowPathIcon className="h-4 w-4" />}
                onClick={() => onClickRetry()}
              >
                {t("retry")}
              </Button>
            )}
          </div>
        </div>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <div className="flex flex-col items-center gap-6">
        <CheckCircleIcon className="h-16 w-16 text-green-500" />
        <div className="text-center">
          <h2 className="mb-2">{t("publish_success.heading")}</h2>
          <p className="text-dim">{t("publish_success.subheading")}</p>
        </div>
        <div className="flex w-full gap-2">
          <Button
            variant="default"
            className="flex-1 justify-center text-center"
            onClick={() => logout()}
          >
            {t("logout")}
          </Button>
          <Button
            variant="primary"
            className="flex-1 justify-center text-center"
            icon={<PlusIcon className="h-4 w-4" />}
            onClick={() => onClickCreateAnotherPage()}
          >
            {t("create_another_page")}
          </Button>
        </div>
      </div>
    </CenteredContainer>
  );
}
