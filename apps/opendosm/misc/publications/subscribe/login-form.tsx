import { routes } from "@lib/routes";
import { post } from "datagovmy-ui/api";
import { At, Button, Input, toast } from "datagovmy-ui/components";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Login Form
 * @overview Status: Live
 */

interface LoginFormProps {
  loading: boolean;
  setIndex: Dispatch<SetStateAction<number>>;
  setLoading: (loading: boolean) => void;
}

const LoginForm: FC<LoginFormProps> = ({ loading, setIndex, setLoading }) => {
  const { t } = useTranslation("publication-subscription");
  const [validation, setValidation] = useState({
    email: "",
    token: "",
  });

  return (
    <form
      className="flex w-full flex-col gap-6 lg:min-h-0 lg:w-3/5 lg:px-20 lg:py-52 xl:w-2/3"
      onSubmit={async ev => {
        ev.preventDefault();

        const formData = new FormData(ev.currentTarget);
        const email = formData.get("email") as string;
        const token = formData.get("token") as string;
        const isValidEmail = /\S+@\S+\.\S+/.test(email);

        if (!isValidEmail || !token || !email) {
          setValidation({
            token: !token ? t("token_required") : "",
            email: !email ? t("email_required") : !isValidEmail ? t("email_invalid") : "",
          });
          return;
        }

        setValidation({
          token: "",
          email: "",
        });
        // setLoading(true);
      }}
    >
      <div className="w-full space-y-4 lg:w-96">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm text-dim">
            {t("email")}
          </label>
          <Input
            name="email"
            type="email"
            onChange={() => {
              setValidation({
                ...validation,
                email: "",
              });
            }}
            validation={validation.email}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="token" className="text-sm text-dim">
            {t("token")}
          </label>
          <Input
            name="token"
            onChange={() =>
              setValidation({
                ...validation,
                token: "",
              })
            }
            validation={validation.token}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="primary"
          type="submit"
          className="w-full justify-center sm:w-fit"
          loading={loading}
        >
          {t("continue")}
        </Button>
        <At className="btn-ghost w-full justify-center sm:w-fit" href={routes.RECOVER_TOKEN}>
          {t("lost_token")}?
        </At>
      </div>
    </form>
  );
};

export default LoginForm;
