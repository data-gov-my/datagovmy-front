import { Button, Spinner } from "datagovmy-ui/components";
import { FunctionComponent } from "react";
import { useTranslation } from "datagovmy-ui/hooks";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AUTH_ERROR, AUTH_ERROR_KEY } from "datagovmy-ui/constants";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { routes } from "@lib/routes";

interface StepAuthProps {
  onClickContinue: () => void;
}

const LogoutIcon: FunctionComponent = () => {
  return (
    <svg
      className="stroke-danger"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 5.40001L14.3 8.00001M14.3 8.00001L11.5 10.6M14.3 8.00001H6.69995M9.49995 2.20001H4.29995C3.4163 2.20001 2.69995 2.91636 2.69995 3.80001V12.2C2.69995 13.0837 3.4163 13.8 4.29995 13.8H9.49995"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const StepAuth: FunctionComponent<StepAuthProps> = ({ onClickContinue }) => {
  const { t } = useTranslation(["gui-opendosm-pub", "common"]);

  const searchParams = useSearchParams();
  const session = useSession();
  const authenticated = session.status === "authenticated";
  const loading = session.status === "loading";

  const authError = searchParams.get(AUTH_ERROR_KEY);

  const logout = () => {
    signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}${routes.GUI_CATALOGUE}` });
  };

  if (loading) {
    return <Spinner loading={loading} />;
  }

  if (authenticated) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <h4 className="text-xl font-bold">{t("step_auth.logged_in.heading")}</h4>
          <p className="text-dim font- text-sm">{t("step_auth.logged_in.subheading")}</p>
          {session.data.user && (
            <div className="my-4 flex flex-col items-center gap-2">
              <div className="aspect-square w-16 overflow-hidden rounded-full border shadow">
                {session.data.user.image && (
                  <Image
                    src={session.data.user.image}
                    width={64}
                    height={64}
                    unoptimized
                    className="h-full w-full"
                    alt="GitHub profile picture"
                  />
                )}
              </div>
              <p>{session.data.user.name}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={() => logout()} className="text-danger border border-red-200 bg-white">
              {t("step_auth.logout")} <LogoutIcon />
            </Button>
            <Button variant="primary" onClick={() => onClickContinue()}>
              {t("step_auth.continue")} <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h4 className="text-xl font-bold">{t("step_auth.login.heading")}</h4>
        <p className="text-dim font- text-sm">{t("step_auth.login.subheading")}</p>
        <Button
          onClick={() => signIn("github")}
          className="bg-background-dark mt-4 h-[42px] text-white"
          icon={
            <Image
              src="/static/images/github-mark-white.svg"
              alt="github logo"
              width={23}
              height={23}
            />
          }
        >
          Login via GitHub
        </Button>
        {authError && (
          <p className="text-danger">
            {authError === AUTH_ERROR.UNAUTHORIZED
              ? t("step_auth.error.unauthorized")
              : t("step_auth.error.unknown")}
          </p>
        )}
      </div>
    </div>
  );
};

export default StepAuth;
