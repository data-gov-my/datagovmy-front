import { post } from "datagovmy-ui/api";
import { Button, Input, toast } from "datagovmy-ui/components";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { setCookie, Timer } from "./utils";

/**
 * Token Form
 * @overview Status: Live
 */

interface TokenFormProps {
  email: string;
  loading: boolean;
  setIndex: Dispatch<SetStateAction<number>>;
  setLoading: (loading: boolean) => void;
  setToken?: (token: string) => void;
  token?: string;
}

const TokenForm: FC<TokenFormProps> = ({
  email,
  loading,
  setIndex,
  setLoading,
  setToken,
  token,
}) => {
  const { t } = useTranslation("publication-subscription");
  const [validation, setValidation] = useState("");
  const [isRunning, setIsRunning] = useState(true);
  const [isSending, setIsSending] = useState(false);

  return (
    <form
      className="flex w-full flex-col gap-6 lg:min-h-0 lg:w-3/5 lg:px-20 lg:py-52 xl:w-2/3"
      onSubmit={async ev => {
        ev.preventDefault();

        const formData = new FormData(ev.currentTarget);
        const token = formData.get("token") as string;
        if (!token) {
          setValidation(t("token_required"));
          return;
        } else {
          setLoading(true);
          setValidation("");
        }
        await post("/token/verify/", { token }, "api")
          .then(() => {
            setCookie("subscription_token", token);
            setToken(token);
            setIndex(i => i + 1);
          })
          .catch(() =>
            toast.error(
              t("common:error.toast.form_submission_failure"),
              t("common:error.toast.reach_support")
            )
          )
          .finally(() => setLoading(false));
      }}
    >
      <p className="w-full text-sm text-black dark:text-white lg:w-96">
        {t("sent_verification")}
        <span className="text-primary dark:text-primary-dark">notif@opendosm.my</span>
        {t("to")}
        <span className="text-primary dark:text-primary-dark">{email}</span>
        {t("check_inbox")}
      </p>
      <div className="w-full space-y-1.5 lg:w-96">
        <label htmlFor="token" className="text-sm text-dim">
          {t("token")}
        </label>
        <Input
          name="token"
          type="text"
          value={token}
          onChange={token => {
            setToken(token);
            setValidation("");
          }}
          validation={validation}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="primary"
          className="w-full justify-center sm:w-fit"
          type="submit"
          loading={loading}
        >
          {t("continue")}
        </Button>
        {isRunning ? (
          <span className="px-3 py-1.5 text-sm">
            {t("resend_in")} <Timer isRunning={isRunning} setIsRunning={setIsRunning} />
          </span>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-center sm:w-fit"
            loading={isSending}
            onClick={async () => {
              setIsSending(true);
              await post("/token/request/", { email }, "api")
                .then(() => setIsRunning(true))
                .catch(err => {
                  toast.error(
                    t("common:error.toast.form_submission_failure"),
                    t("common:error.toast.reach_support")
                  );
                  console.error(err);
                })
                .finally(() => setIsSending(false));
            }}
          >
            {t("resend")}
          </Button>
        )}
      </div>
    </form>
  );
};

export default TokenForm;
