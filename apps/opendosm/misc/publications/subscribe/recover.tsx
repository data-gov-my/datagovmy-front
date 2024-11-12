import { CheckCircleIcon, UserIcon } from "@heroicons/react/20/solid";
import { At, Button } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { useState } from "react";
import Layout from "./layout";
import Success from "./success";
import { routes } from "@lib/routes";
import { copyClipboard } from "datagovmy-ui/helpers";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import EmailForm from "./email-form";
import TokenForm from "./token-form";

/**
 * Recover Subscription Token
 * @overview Status: Live
 */

interface RecoverSubscriptionTokenProps {}

const RecoverSubscriptionToken = ({}: RecoverSubscriptionTokenProps) => {
  const { t } = useTranslation("publication-subscription");

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const STEPS = [
    {
      icon: UserIcon,
      step: "recover.step1",
      desc: "recover.step1_desc",
      tab: (
        <EmailForm
          email={email}
          setEmail={setEmail}
          loading={loading}
          setIndex={setIndex}
          setLoading={setLoading}
        />
      ),
    },
    {
      icon: CheckCircleIcon,
      step: "recover.step2",
      desc: "recover.step2_desc",
      tab: (
        <TokenForm email={email} loading={loading} setIndex={setIndex} setLoading={setLoading} />
      ),
    },
  ];

  return index === 2 ? (
    <Success title={t("recover.success")} description={t("recover.success_desc")}>
      <>
        <div className="w-full space-y-1.5 lg:w-96">
          <p className="text-sm text-dim">{t("recover.your_token")}</p>
          <Button
            variant="default"
            className="w-full justify-between sm:w-96"
            onClick={() => copyClipboard(token)}
          >
            <span className="max-w-full truncate">{token}</span>
            <DocumentDuplicateIcon className="size-5 shrink-0" />
          </Button>
        </div>
        <div className="flex w-full gap-2 sm:w-96">
          <At
            className="btn-primary w-full justify-center shadow-button"
            href={routes.MANAGE_SUBSCRIPTION}
          >
            {t("view_subscription")}
          </At>
          <At
            className="btn btn-border w-full justify-center bg-white px-3 py-1.5 text-sm text-black shadow-button active:bg-washed"
            href={routes.PUBLICATIONS}
          >
            {t("done")}
          </At>
        </div>
      </>
    </Success>
  ) : (
    <Layout header={t("recover.header")} currentIndex={index} steps={STEPS}>
      {STEPS[index].tab}
    </Layout>
  );
};

export default RecoverSubscriptionToken;
