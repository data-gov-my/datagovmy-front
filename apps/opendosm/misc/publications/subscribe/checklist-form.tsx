import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { post, put } from "datagovmy-ui/api";
import { Button, NestedChecklist, toast } from "datagovmy-ui/components";
import { parseCookies } from "datagovmy-ui/helpers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Checklist Form
 * @overview Status: Live
 */

interface ChecklistFormProps {
  data: Record<string, Record<string, string>>;
  loading: boolean;
  setIndex?: Dispatch<SetStateAction<number>>;
  setLoading: (loading: boolean) => void;
  subscribed?: string[];
}

const ChecklistForm: FC<ChecklistFormProps> = ({
  data,
  loading,
  setIndex,
  setLoading,
  subscribed,
}) => {
  const { t, i18n } = useTranslation("publication-subscription");
  const [nodes, setNodes] = useState(transform(data, subscribed));
  useEffect(() => setNodes(transform(data, subscribed)), [i18n, subscribed]);

  return (
    <form
      onSubmit={async ev => {
        ev.preventDefault();

        let pubs = [];
        const formData = new FormData(ev.currentTarget);
        for (const entry of formData.entries()) pubs.push(entry[1]);
        const body = new FormData();
        pubs.map(pub => body.append("publications", pub));

        const cookie = parseCookies(document.cookie);

        if (pubs && "subscription_token" in cookie) {
          await put("subscriptions/", body, "api", {
            Authorization: cookie.subscription_token,
          })
            .then(() => {
              setIndex
                ? setIndex(index => index + 1)
                : toast.success(
                    <>
                      <CheckCircleIcon className="size-4.5 text-green-600" />
                      {t("changes_saved")}
                    </>
                  );
            })
            .catch(err => {
              toast.error(
                t("common:error.toast.form_submission_failure"),
                t("common:error.toast.reach_support")
              );
              console.error(err);
            })
            .finally(() => setLoading(false));
        }
      }}
      className="flex w-full flex-col gap-6 lg:min-h-0 lg:w-3/5 lg:px-20 lg:py-12 xl:w-2/3"
    >
      <div className="space-y-0.5 text-black dark:text-white">
        <h2 className="font-body text-base font-bold">{t("choose_publication")}</h2>
        <p className="text-sm text-dim">{t("choose_publication_desc")}</p>
      </div>
      <NestedChecklist data={nodes} label={t("select_all")} setData={setNodes} />
      <Button
        variant="primary"
        type="submit"
        className="w-full justify-center sm:w-fit"
        loading={loading}
      >
        {t(subscribed ? "save" : "subscribe")}
      </Button>
    </form>
  );
};

function transform(data: Record<string, Record<string, string>>, subscribed: string[]) {
  const root = {
    label: "root",
    value: "root",
    checked: false,
    children: [],
  };

  const types = Object.keys(data).map(key => {
    const value = data[key];
    const node = {
      label: key,
      value: key,
      checked: false,
      children: [],
      parent: root,
    };

    const subtypes = Object.entries(value).map(([value, label]) => ({
      label: label,
      value: value,
      checked: subscribed ? subscribed.includes(value) : false,
      children: [],
      parent: node,
    }));

    node.children = subtypes;
    if (subtypes.every(node => node.checked)) node.checked = true;
    return node;
  });

  root.children = types;
  if (types.every(node => node.checked)) root.checked = true;
  return root;
}

export default ChecklistForm;
