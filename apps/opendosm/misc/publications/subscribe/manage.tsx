import { NewspaperIcon, UserIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "datagovmy-ui/hooks";
import { useEffect, useState } from "react";
import Layout from "./layout";
import { parseCookies } from "datagovmy-ui/helpers";
import ChecklistForm from "./checklist-form";
import LoginForm from "./login-form";

/**
 * Manage Subscriptions
 * @overview Status: Live
 */

interface ManageSubscriptionsProps {
  data: Record<string, Record<string, string>>;
  subscribed: string[];
}

const ManageSubscriptions = ({ data, subscribed }: ManageSubscriptionsProps) => {
  const { t } = useTranslation("publication-subscription");

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cookie = parseCookies(document.cookie);
    if ("subscription_token" in cookie) setIndex(1);
  }, []);

  const STEPS = [
    {
      icon: <UserIcon className="size-7" />,
      step: "manage.step1",
      desc: "manage.step1_desc",
      tab: <LoginForm loading={loading} setIndex={setIndex} setLoading={setLoading} />,
    },
    {
      icon: <NewspaperIcon className="size-7" />,
      step: "manage.step2",
      desc: "manage.step2_desc",
      tab: (
        <ChecklistForm
          data={data}
          loading={loading}
          setIndex={setIndex}
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
