import { CheckCircleIcon, NewspaperIcon, UserIcon } from "@heroicons/react/20/solid";
import { At } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import { useEffect, useState } from "react";
import Layout from "./layout";
import Success from "./success";
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
  token?: string;
}

const NewSubscription = ({ data, token }: NewSubscriptionProps) => {
  const { t } = useTranslation("publication-subscription");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (token) setIndex(1);
  }, []);

  const STEPS = [
    {
      icon: <UserIcon className="size-7" />,
      step: "new.step1",
      desc: "new.step1_desc",
      form: (
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
      icon: <CheckCircleIcon className="size-7" />,
      step: "new.step2",
      desc: "new.step2_desc",
      form: (
        <TokenForm
          email={email}
          loading={loading}
          setIndex={setIndex}
          setLoading={setLoading}
          token={token}
        />
      ),
    },
    {
      icon: <NewspaperIcon className="size-7" />,
      step: "new.step3",
      desc: "new.step3_desc",
      form: (
        <ChecklistForm data={data} loading={loading} setIndex={setIndex} setLoading={setLoading} />
      ),
    },
  ];

  return index === 3 ? (
    <Success title={t("new.success")} description={t("new.success_desc")}>
      <At
        className="btn-primary w-full justify-center shadow-button sm:w-fit"
        href={routes.PUBLICATIONS}
      >
        {t("done")}
      </At>
    </Success>
  ) : (
    <Layout header={t("new.header")} currentIndex={index} steps={STEPS}>
      {STEPS[index].form}
    </Layout>
  );
};

export default NewSubscription;
