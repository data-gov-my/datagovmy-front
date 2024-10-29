import { post } from "datagovmy-ui/api";
import { Button, NestedChecklist, toast } from "datagovmy-ui/components";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Checklist Form
 * @overview Status: Live
 */

interface ChecklistFormProps {
  data: Record<string, Record<string, string>>;
  loading: boolean;
  setIndex: Dispatch<SetStateAction<number>>;
  setLoading: (loading: boolean) => void;
  subscribed?: string[];
}

const ChecklistForm: FC<ChecklistFormProps> = ({
  data,
  loading,
  setIndex,
  setLoading,
  subscribed = [],
}) => {
  const { t, i18n } = useTranslation("publication-subscription");
  const [nodes, setNodes] = useState(transform(data, subscribed));
  useEffect(() => setNodes(transform(data, subscribed)), [i18n]);

  return (
    <form
      onSubmit={async ev => {
        ev.preventDefault();
        setIndex(index => index + 1); // temp
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
        {t(subscribed.length > 0 ? "save" : "subscribe")}
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
      checked: subscribed.length > 0 ? subscribed.includes(value) : subscribed,
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
