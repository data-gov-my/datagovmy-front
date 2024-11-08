import { NewspaperIcon, UserIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "datagovmy-ui/hooks";
import { useEffect, useState } from "react";
import Layout from "./layout";
import { parseCookies } from "datagovmy-ui/helpers";
import ChecklistForm from "./checklist-form";
import LoginForm from "./login-form";
import { get } from "datagovmy-ui/api";
import { toast } from "datagovmy-ui/components";

/**
 * Manage Subscriptions
 * @overview Status: Live
 */

interface ManageSubscriptionsProps {
  data: Record<string, Record<string, string>>;
}

const ManageSubscriptions = ({ data }: ManageSubscriptionsProps) => {
  const { t } = useTranslation("publication-subscription");

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState<string[]>([]);

  useEffect(() => {
    const cookie = parseCookies(document.cookie);
    if ("subscription_token" in cookie) {
      setIndex(1);
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
      step: "manage.step1",
      desc: "manage.step1_desc",
      tab: (
        <LoginForm
          loading={loading}
          setIndex={setIndex}
          setLoading={setLoading}
          setSubscribed={setSubscribed}
        />
      ),
    },
    {
      icon: NewspaperIcon,
      step: "manage.step2",
      desc: "manage.step2_desc",
      tab: (
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
    <Layout header={t("manage.header")} currentIndex={index} steps={STEPS}>
      {STEPS[index].tab}
    </Layout>
  );
};

export default ManageSubscriptions;
