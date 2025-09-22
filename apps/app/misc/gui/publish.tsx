import {
  CheckCircleIcon,
  PlusIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import { routes } from "@lib/routes";
import { Button, Spinner } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { signOut } from "next-auth/react";
import { useState } from "react";

type Status =
  | { state: "loading" }
  | { state: "success" }
  | { state: "error"; data: { fileName: string; json: string } };

export function usePublishDataCatalogue() {
  const [status, setStatus] = useState<Status | null>(null);

  const reset = () => setStatus(null);

  const publishDataCatalogue = async ({ fileName, json }: { fileName: string; json: string }) => {
    setStatus({ state: "loading" });
    try {
      const response = await fetch("/api/data-catalogue/open-pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName, data: window.btoa(json) }),
      });
      if (!response.ok) {
        throw Error("Response was not ok");
      }
      setStatus({ state: "success" });
    } catch (error) {
      setStatus({ state: "error", data: { fileName, json } });
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
  status: Status;
  onClickCreateAnotherPage: () => void;
};
export function PublishDataCatalogueModal({
  status,
  onClickCreateAnotherPage,
}: PublishDataCatalogueModalProps) {
  const { t } = useTranslation("gui-data-catalogue");

  const logout = () => {
    signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}${routes.GUI_CATALOGUE}` });
  };

  if (status.state === "loading") {
    return (
      <CenteredContainer>
        <div className="flex flex-col items-center gap-4">
          <Spinner loading className="h-20 w-20" />
          <p>{t("common:placeholder.loading")}</p>
        </div>
      </CenteredContainer>
    );
  }

  if (status.state === "error") {
    const { fileName, json } = status.data;
    return (
      <CenteredContainer>
        <div className="flex flex-col items-center gap-6">
          <ExclamationCircleIcon className="text-danger h-16 w-16" />
          <div className="text-center">
            <h2 className="mb-2">{t("publish.error.heading")}</h2>
            <p className="text-dim">{t("publish.error.subheading")}</p>
          </div>
          <div className="flex w-full gap-2">
            <Button
              variant="default"
              className="flex-1 justify-center text-center"
              onClick={() => logout()}
            >
              {t("step_auth.logout")}
            </Button>
            <Button
              variant="primary"
              className="flex-1 justify-center text-center"
              onClick={() => {
                const jsonBlob = new Blob([json], { type: "application/json" });

                // Create a temporary link
                const url = URL.createObjectURL(jsonBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName; // filename for user
                a.click();

                // Cleanup
                URL.revokeObjectURL(url);
              }}
            >
              {t("publish.save_output")} <ArrowDownTrayIcon className="h-4 w-4" />
            </Button>
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
          <h2 className="mb-2">{t("publish.success.heading")}</h2>
          <p className="text-dim">{t("publish.success.subheading")}</p>
        </div>
        <div className="flex w-full gap-2">
          <Button
            variant="default"
            className="flex-1 justify-center text-center"
            onClick={() => logout()}
          >
            {t("step_auth.logout")}
          </Button>
          <Button
            variant="primary"
            className="flex-1 justify-center text-center"
            icon={<PlusIcon className="h-4 w-4" />}
            onClick={() => onClickCreateAnotherPage()}
          >
            {t("publish.create_another_page")}
          </Button>
        </div>
      </div>
    </CenteredContainer>
  );
}
