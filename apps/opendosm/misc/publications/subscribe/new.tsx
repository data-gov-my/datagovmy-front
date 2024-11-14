import { CheckCircleIcon, NewspaperIcon, UserIcon } from "@heroicons/react/20/solid";
import { At } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { useState } from "react";
import Layout from "./layout";
import { routes } from "@lib/routes";
import EmailForm from "./email-form";
import TokenForm from "./token-form";
import ChecklistForm from "./checklist-form";

/**
 * New Publication Subscription
 * @overview Status: Live
 */

interface NewSubscriptionProps {
  data: Record<string, Record<string, string>>;
}

const NewSubscription = ({ data }: NewSubscriptionProps) => {
  const { t } = useTranslation("publication-subscription");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  const STEPS = [
    {
      icon: UserIcon,
      name: t("step1"),
      desc: t("step1_desc"),
      form: (
        <EmailForm
          email={email}
          loading={loading}
          setEmail={setEmail}
          setIndex={setIndex}
          setLoading={setLoading}
          signUp
        />
      ),
    },
    {
      icon: CheckCircleIcon,
      name: t("step2"),
      desc: t("step2_desc"),
      form: (
        <TokenForm email={email} loading={loading} setIndex={setIndex} setLoading={setLoading} />
      ),
    },
    {
      icon: NewspaperIcon,
      name: t("step3"),
      desc: t("step3_desc"),
      form: (
        <ChecklistForm data={data} loading={loading} setIndex={setIndex} setLoading={setLoading} />
      ),
    },
  ];

  return index === 3 ? (
    <div className="flex min-h-[90dvh] flex-col items-center justify-center gap-6 p-4.5 sm:gap-8">
      <div className="flex flex-col items-center gap-y-6">
        <CheckCircleIcon className="size-[72px] text-green-600" />
        <div className="space-y-3 text-center sm:w-[450px]">
          <h2 className="text-black dark:text-white">{t("success")}</h2>
          <p className="text-sm text-dim">
            {t("success_desc")}{" "}
            <span className="text-primary dark:text-primary-dark">notif@opendosm.my</span>.
          </p>
        </div>
      </div>
      <At
        className="btn-primary w-full justify-center shadow-button sm:w-fit"
        href={routes.PUBLICATIONS}
      >
        {t("return")}
      </At>
    </div>
  ) : (
    <Layout header={t("header")} currentIndex={index} steps={STEPS}>
      {STEPS[index].form}
    </Layout>
  );
};

export default NewSubscription;
