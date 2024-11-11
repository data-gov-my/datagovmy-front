import { routes } from "@lib/routes";
import { post } from "datagovmy-ui/api";
import { At, Button, Input, toast } from "datagovmy-ui/components";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Email Form
 * @overview Status: Live
 */

interface EmailFormProps {
  email: string;
  loading: boolean;
  setEmail: (email: string) => void;
  setIndex: Dispatch<SetStateAction<number>>;
  setLoading: (loading: boolean) => void;
  signUp?: boolean;
}

const EmailForm: FC<EmailFormProps> = ({
  email,
  loading,
  setEmail,
  setIndex,
  setLoading,
  signUp = false,
}) => {
  const { t } = useTranslation("publication-subscription");
  const [redirect, setRedirect] = useState(false);
  const [validation, setValidation] = useState("");

  return (
    <form
      className="flex w-full flex-col gap-6 lg:min-h-0 lg:w-3/5 lg:px-20 lg:py-52 xl:w-2/3"
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
        await post("/check-subscription/", { email })
          .then(({ data }: { data: { message: string } }) => {
            if (data.message.startsWith(signUp ? "Email does not exist" : "Email does exist"))
              post("/token/request/", { email })
                .then(() => setIndex(index => index + 1))
                .catch(err => {
                  toast.error(
                    t("common:error.toast.form_submission_failure"),
                    t("common:error.toast.reach_support")
                  );
                  console.error(err);
                });
            else setRedirect(true);
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
          }}
          validation={validation}
        />
      </div>
      {redirect && (
        <span className="text-sm text-dim">
          {t(signUp ? "email_present" : "email_absent")}{" "}
          <At
            className="link-primary"
            href={signUp ? routes.MANAGE_SUBSCRIPTION : routes.NEW_SUBSCRIPTION}
          >
            {t("here")}
          </At>
          .
        </span>
      )}

      <Button
        variant="primary"
        type="submit"
        className="w-full justify-center sm:w-fit"
        loading={loading}
      >
        {t("continue")}
      </Button>
    </form>
  );
};

export default EmailForm;
