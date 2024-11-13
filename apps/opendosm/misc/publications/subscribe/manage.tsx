import { CheckCircleIcon, NewspaperIcon, UserIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "datagovmy-ui/hooks";
import { useEffect, useState } from "react";
import Layout from "./layout";
import { parseCookies } from "datagovmy-ui/helpers";
import ChecklistForm from "./checklist-form";
import { get } from "datagovmy-ui/api";
import { toast } from "datagovmy-ui/components";
import EmailForm from "./email-form";
import TokenForm from "./token-form";

/**
 * Manage Subscriptions
 * @overview Status: Live
 */

interface ManageSubscriptionsProps {
  data: Record<string, Record<string, string>>;
}

const ManageSubscriptions = ({ data }: ManageSubscriptionsProps) => {
  const { t } = useTranslation("publication-manage");

  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState<string[]>([]);

  useEffect(() => {
    const cookie = parseCookies(document.cookie);
    if ("subscription_token" in cookie) {
      setIndex(2);
      get("/subscriptions/", undefined, "api", { Authorization: cookie.subscription_token })
        .then(({ data }) => setSubscribed(data.data))
        .catch(err => {
          toast.error(
            t("common:error.toast.form_submission_failure"),
            t("common:error.toast.reach_support")
          );
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const STEPS = [
    {
      icon: UserIcon,
      step: t("step1"),
      desc: t("step1_desc"),
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
      icon: CheckCircleIcon,
      step: t("step2"),
      desc: t("step2_desc"),
      form: (
        <TokenForm
          email={email}
          loading={loading}
          setIndex={setIndex}
          setLoading={setLoading}
          setSubscribed={setSubscribed}
        />
      ),
    },
    {
      icon: NewspaperIcon,
      step: t("step3"),
      desc: t("step3_desc"),
      form: (
        <ChecklistForm
          data={data}
          loading={loading}
          setLoading={setLoading}
          subscribed={subscribed}
        />
      ),
    },
  ];

  return (
    <Layout header={t("header")} currentIndex={index} steps={STEPS}>
      {STEPS[index].form}
    </Layout>
  );
};

export default ManageSubscriptions;
