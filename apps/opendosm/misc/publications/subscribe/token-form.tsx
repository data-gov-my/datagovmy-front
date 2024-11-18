import { get, post } from "datagovmy-ui/api";
import { Button, Input, toast } from "datagovmy-ui/components";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useTranslation } from "datagovmy-ui/hooks";
import { deleteCookie, setCookie, Timer } from "./utils";

/**
 * Token Form
 * @overview Status: Live
 */

interface TokenFormProps {
  email: string;
  setIndex: Dispatch<SetStateAction<number>>;
  setSubscribed?: Dispatch<SetStateAction<string[]>>;
}

const TokenForm: FC<TokenFormProps> = ({ email, setIndex, setSubscribed }) => {
  const { t } = useTranslation(setSubscribed ? "publication-manage" : "publication-subscription");
  const [token, setToken] = useState("");
  const [validation, setValidation] = useState("");
  const [loading, setLoading] = useState(false);

  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isResending, setIsResending] = useState(false);

  return (
    <form
      className="flex w-full flex-col gap-6 lg:min-h-0 lg:w-3/5 lg:px-20 lg:py-40 xl:w-2/3"
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
        await get("/subscriptions/", undefined, "api", { Authorization: token })
          .then(({ data }) => {
            setCookie("subscription_token", token);
            setIndex(i => i + 1);
            if (setSubscribed && data.data) setSubscribed(data.data);
          })
          .catch(err => {
            if (err.response.status === 401) {
              toast.error(t("token_expired"), t("request_again"));
              deleteCookie("subscription_token");
            } else
              toast.error(
                t("common:error.toast.form_submission_failure"),
                t("common:error.toast.reach_support")
              );
            console.error(err);
          })
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
        {isTimerRunning ? (
          <span className="px-3 py-1.5 text-sm">
            {t("resend_in")} <Timer isRunning={isTimerRunning} setIsRunning={setIsTimerRunning} />
          </span>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-center sm:w-fit"
            loading={isResending}
            onClick={async () => {
              setIsResending(true);
              await post("/token/request/", { email }, "api")
                .then(() => setIsTimerRunning(true))
                .catch(err => {
                  toast.error(
                    t("common:error.toast.form_submission_failure"),
                    t("common:error.toast.reach_support")
                  );
                  console.error(err);
                })
                .finally(() => setIsResending(false));
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
