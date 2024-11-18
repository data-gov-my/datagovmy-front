import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { routes } from "@lib/routes";
import { put } from "datagovmy-ui/api";
import { At, Button, NestedChecklist, toast } from "datagovmy-ui/components";
import { parseCookies } from "datagovmy-ui/helpers";
import { useTranslation } from "datagovmy-ui/hooks";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { deleteCookie } from "./utils";
import { useRouter } from "next/router";

/**
 * Checklist Form
 * @overview Status: Live
 */

interface ChecklistFormProps {
  data: Record<string, Record<string, string>>;
  setIndex?: Dispatch<SetStateAction<number>>;
  subscribed?: string[];
}

const ChecklistForm: FC<ChecklistFormProps> = ({ data, setIndex, subscribed }) => {
  const { t, i18n } = useTranslation(setIndex ? "publication-subscription" : "publication-manage");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState(transform(data, subscribed));
  useEffect(() => setNodes(transform(data, subscribed)), [i18n, subscribed]);
  const router = useRouter();

  return (
    <form
      onSubmit={async ev => {
        ev.preventDefault();

        let pubs: string[] = [];
        const formData = new FormData(ev.currentTarget);
        const body = new FormData();
        for (const entry of formData.entries()) {
          const pub = entry[1] as string;
          if (pub === "all") {
            body.append("publications", "all");
            break;
          } else body.append("publications", pub);
        }

        const cookie = parseCookies(document.cookie);

        if (pubs && "subscription_token" in cookie) {
          await put("/subscriptions/", body, "api", {
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
            .catch(({ response }) => {
              if (response.status === 401) {
                toast.error(t("token_expired"), t("request_again"));
                deleteCookie("subscription_token");
                setTimeout(() => {
                  setIndex ? router.push(routes.MANAGE_SUBSCRIPTION) : router.reload();
                }, 1000);
              } else
                toast.error(
                  t("common:error.toast.form_submission_failure"),
                  t("common:error.toast.reach_support")
                );
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
      <div className="flex flex-col gap-x-3 gap-y-2 sm:flex-row">
        <Button
          variant="primary"
          type="submit"
          className="w-full justify-center sm:w-fit"
          loading={loading}
        >
          {t(subscribed ? "save" : "subscribe")}
        </Button>
        {subscribed && (
          <At href={routes.PUBLICATIONS}>
            <Button
              variant="ghost"
              type="submit"
              className="w-full justify-center sm:w-fit"
              onClick={() => deleteCookie("subscription_token")}
            >
              {t("log_out")}
            </Button>
          </At>
        )}
      </div>
    </form>
  );
};

function transform(data: Record<string, Record<string, string>>, subscribed: string[]) {
  const root = {
    label: "all",
    value: "all",
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
      checked: subscribed
        ? subscribed.includes("all")
          ? true
          : subscribed.includes(value)
        : false,
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
