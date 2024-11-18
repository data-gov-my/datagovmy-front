import { CheckCircleIcon, NewspaperIcon, UserIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "datagovmy-ui/hooks";
import { useEffect, useState } from "react";
import Layout from "./layout";
import { parseCookies } from "datagovmy-ui/helpers";
import ChecklistForm from "./checklist-form";
import { get } from "datagovmy-ui/api";
import { Spinner, toast } from "datagovmy-ui/components";
import EmailForm from "./email-form";
import TokenForm from "./token-form";
import { deleteCookie } from "./utils";
import { useRouter } from "next/router";

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
  const router = useRouter();

  useEffect(() => {
    const cookie = parseCookies(document.cookie);
    if ("subscription_token" in cookie) {
      setLoading(true);
      get("/subscriptions/", undefined, "api", { Authorization: cookie.subscription_token })
        .then(({ data }) => {
          setSubscribed(data.data);
          setIndex(2);
        })
        .catch(err => {
          if (err.response.status === 401) {
            deleteCookie("subscription_token");
            router.reload();
          } else
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
      name: t("step1"),
      desc: t("step1_desc"),
      form: <EmailForm email={email} setEmail={setEmail} setIndex={setIndex} />,
    },
    {
      icon: CheckCircleIcon,
      name: t("step2"),
      desc: t("step2_desc"),
      form: <TokenForm email={email} setIndex={setIndex} setSubscribed={setSubscribed} />,
    },
    {
      icon: NewspaperIcon,
      name: t("step3"),
      desc: t("step3_desc"),
      form: <ChecklistForm data={data} subscribed={subscribed} />,
    },
  ];

  return loading ? (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <Spinner loading={loading} />
    </div>
  ) : (
    <Layout header={t("header")} currentIndex={index} steps={STEPS}>
      {STEPS[index].form}
    </Layout>
  );
};

export default ManageSubscriptions;
