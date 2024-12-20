import { routes } from "@lib/routes";
import { post } from "datagovmy-ui/api";
import { At, Button, Callout, Input, toast } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { Dispatch, FC, SetStateAction, useState } from "react";

/**
 * Email Form
 * @overview Status: Live
 */

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  setIndex: Dispatch<SetStateAction<number>>;
  signUp?: boolean;
}

const EmailForm: FC<EmailFormProps> = ({ email, setEmail, setIndex, signUp = false }) => {
  const { t } = useTranslation(signUp ? "publication-subscription" : "publication-manage");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [validation, setValidation] = useState("");

  return (
    <form
      className="flex w-full flex-col gap-6 lg:min-h-0 lg:w-3/5 lg:px-20 lg:py-44 xl:w-2/3"
      onSubmit={async ev => {
        ev.preventDefault();

        if (!email) {
          setValidation(t("email_required"));
          return;
        }
        const isValidEmail = /\S+@\S+\.\S+/.test(email);
        if (!isValidEmail) {
          setValidation(t("email_invalid"));
          return;
        }
        setValidation("");
        setLoading(true);
        setRedirect(false);
        await post(signUp ? "/check-subscription/" : "/token/request/", { email })
          .then(({ data }: { data: { message: string } }) => {
            if (data.message.startsWith(signUp ? "Email does exist" : "Not subscribed"))
              setRedirect(true);
            else setIndex(i => i + 1);
          })
          .catch(err => {
            toast.error(
              t("common:error.toast.form_submission_failure"),
              t("common:error.toast.reach_support")
            );
            console.error(err);
          })
          .finally(() => setLoading(false));
      }}
    >
      <div className="w-full space-y-1.5 lg:w-96">
        <label htmlFor="email" className="text-sm text-dim">
          {t("email")}
        </label>
        <Input
          name="email"
          type="email"
          value={email}
          onChange={email => {
            setEmail(email);
            setValidation("");
            setRedirect(false);
          }}
          validation={validation}
        />
      </div>
      {redirect && (
        <div className="w-full lg:w-96">
          <Callout variant="warning">
            <span>
              {t(signUp ? "email_present" : "email_absent")}{" "}
              <At
                className="link-primary"
                href={signUp ? routes.MANAGE_SUBSCRIPTION : routes.NEW_SUBSCRIPTION}
              >
                {t(signUp ? "manage_here" : "subscribe_now")}
              </At>
              .
            </span>
          </Callout>
        </div>
      )}

      <Button
        variant="primary"
        type="submit"
        className="w-full justify-center sm:w-fit"
        loading={loading}
        disabled={redirect}
      >
        {t("continue")}
      </Button>
    </form>
  );
};

export default EmailForm;
