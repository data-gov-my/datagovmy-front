import { FunctionComponent, MutableRefObject, useContext, useState } from "react";
import { Card, Section, Tooltip, Dropdown } from "../../components";
import { useAnalytics, useTranslation } from "../../hooks";
import { interpolate, toDate } from "../../lib/helpers";
import Table from "../../charts/table";
import { METADATA_TABLE_SCHEMA } from "../../lib/schema/data-catalogue";
import { DCVariable } from "../../../types/data-catalogue";
import { CatalogueContext } from "../../contexts/catalogue";
import { OptionType } from "../../../types";

type MetadataGUI =
  | {
      isGUI: true;
      scrollRef?: never;
      setMetadata: (key: string, value: any) => void;
    }
  | MetadataDefault;

type MetadataDefault = {
  isGUI: false;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
  setMetadata?: never;
};

type MetadataProps = MetadataGUI & {
  metadata: Pick<
    DCVariable,
    | "description"
    | "fields"
    | "last_updated"
    | "next_update"
    | "data_source"
    | "link_csv"
    | "link_parquet"
    | "link_editions"
  >;
};

const DCMetadata: FunctionComponent<MetadataProps> = ({
  isGUI,
  scrollRef,
  setMetadata,
  metadata,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const { dataset } = useContext(CatalogueContext);
  const { track } = useAnalytics(dataset);

  const hasEditions = metadata.link_editions != undefined && metadata.link_editions.length > 0;
  const [selectedEdition, setSelectedEdition] = useState<OptionType | undefined>(() =>
    hasEditions && metadata.link_editions
      ? { label: metadata.link_editions[0], value: metadata.link_editions[0] }
      : undefined
  );

  const getUrl = (url: string) => {
    return hasEditions && selectedEdition
      ? url.replace("YYYY-MM-DD", selectedEdition.value as string)
      : url;
  };

  return (
    <>
      <Section
        title={"Metadata"}
        ref={ref => {
          scrollRef &&
            (scrollRef.current[
              i18n.language === "en-GB" ? "Metadata: Variables" : "Metadata: Pembolehubah"
            ] = ref);
        }}
        className="dark:border-b-outlineHover-dark mx-auto border-b py-8 lg:py-12"
      >
        <Card className="bg-background dark:border-outlineHover-dark dark:bg-washed-dark p-6">
          <div className="space-y-6">
            {/* Dataset description */}
            <div className="space-y-3">
              <h5>{t("meta_desc")}</h5>
              <p className="text-dim leading-relaxed">{interpolate(metadata.description)}</p>
            </div>
            <div className="space-y-3">
              {/* Variable definitions */}
              <h5>{t("meta_def")}</h5>
              {metadata.fields?.length > 0 && (
                <>
                  <ul className="text-dim ml-6 list-outside list-disc md:hidden">
                    {metadata.fields?.map(item => (
                      <li key={item.title}>
                        <span className="flex gap-x-1">
                          {item.title}
                          <Tooltip tip={interpolate(item.description)} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="hidden md:block">
                    <Table
                      className="table-slate table-default-slate md:w-full"
                      data={metadata.fields.map(item => {
                        const raw = item.description;
                        const [type, definition] = [
                          raw.substring(raw.indexOf("[") + 1, raw.indexOf("]")),
                          raw.substring(raw.indexOf("]") + 1),
                        ];

                        return {
                          variable: item.name,
                          variable_name: item.title,
                          data_type: type,
                          definition: interpolate(definition),
                        };
                      })}
                      config={METADATA_TABLE_SCHEMA(t, true)}
                    />
                  </div>
                </>
              )}
            </div>
            {/* Last updated */}
            <div className="space-y-3">
              <h5>{t("common:common.last_updated", { date: "" })}</h5>
              <p className="text-dim whitespace-pre-line" data-testid="catalogue-last-updated">
                {toDate(metadata.last_updated, "dd MMM yyyy, HH:mm", i18n.language)}
              </p>
            </div>
            {/* Next update */}
            <div
              className="space-y-3"
              ref={ref => {
                scrollRef &&
                  (scrollRef.current[
                    i18n.language === "en-GB"
                      ? "Metadata: Next update"
                      : "Metadata: Kemaskini seterusnya"
                  ] = ref);
              }}
            >
              <h5>{t("common:common.next_update", { date: "" })}</h5>
              <p className="text-dim" data-testid="catalogue-next-update">
                {toDate(metadata.next_update, "dd MMM yyyy, HH:mm", i18n.language)}
              </p>
            </div>
            {/* Data Source */}
            <div className="space-y-3">
              <h5>{t("meta_source")}</h5>
              <ul className="text-dim ml-6 list-outside list-disc">
                {metadata.data_source.map(source => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
            </div>
            {/* URLs to dataset */}
            <div className="space-y-3">
              <h5>{t("meta_url")}</h5>
              {hasEditions && metadata.link_editions && (
                <Dropdown
                  options={metadata.link_editions!.map(edition => ({
                    label: edition,
                    value: edition,
                  }))}
                  selected={selectedEdition}
                  onChange={selected => setSelectedEdition(selected as OptionType)}
                  placeholder={t("common:common.select_edition")}
                  className="w-fit"
                  width="w-fit"
                  anchor="left"
                />
              )}
              <ul className="text-dim ml-6 list-outside list-disc">
                {Object.entries({
                  csv: metadata.link_csv,
                  parquet: metadata.link_parquet,
                }).map(([key, url]: [string, unknown]) =>
                  url ? (
                    <li key={url as string}>
                      <a
                        href={getUrl(url as string)}
                        className="text-primary dark:text-primary-dark break-all [text-underline-position:from-font] hover:underline"
                        onClick={() =>
                          track(key === "link_geojson" ? "csv" : (key as "parquet" | "csv"))
                        }
                      >
                        {getUrl(url as string)}
                      </a>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
            {/* License */}
            <div
              className="space-y-3"
              ref={ref => {
                scrollRef &&
                  (scrollRef.current[
                    i18n.language === "en-GB" ? "Metadata: License" : "Metadata: Lesen"
                  ] = ref);
              }}
            >
              <h5>{t("meta_license")}</h5>
              <p className="text-dim">
                {t("license_text")}{" "}
                <a
                  className="text-primary dark:text-primary-dark lowercase [text-underline-position:from-font] hover:underline"
                  target="_blank"
                  rel="noopener"
                  href="https://creativecommons.org/licenses/by/4.0/"
                >
                  {t("common:common.here")}.
                </a>
              </p>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
};

export default DCMetadata;
