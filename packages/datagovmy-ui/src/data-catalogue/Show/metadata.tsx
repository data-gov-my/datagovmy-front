import { FunctionComponent, MutableRefObject } from "react";
import { At, Card, Section, Tooltip } from "../../components";
import { useTranslation } from "../../hooks";
import { interpolate, toDate } from "../../lib/helpers";
import Table from "../../charts/table";
import { METADATA_TABLE_SCHEMA } from "../../lib/schema/data-catalogue";

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

type MetadataProps = MetadataGUI;

const DCMetadata: FunctionComponent<MetadataProps> = ({ isGUI, scrollRef, setMetadata }) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);

  return (
    <>
      <Section
        title={"Metadata"}
        ref={ref =>
          scrollRef &&
          (scrollRef.current[
            i18n.language === "en-GB" ? "Metadata: Variables" : "Metadata: Pembolehubah"
          ] = ref)
        }
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
              {metadata.definitions?.length > 0 && (
                <>
                  <ul className="text-dim ml-6 list-outside list-disc md:hidden">
                    {metadata.definitions?.map(item => (
                      <li key={item.title}>
                        <span className="flex gap-x-1">
                          {Boolean(item.unique_id) ? (
                            <At href={`/data-catalogue/${item.unique_id}`}>{item.title}</At>
                          ) : (
                            item.title
                          )}
                          <Tooltip tip={interpolate(item.desc)} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="hidden md:block">
                    <Table
                      className="table-slate table-default-slate md:w-full"
                      data={metadata.definitions.map((item: any) => {
                        const raw = item.desc;
                        const [type, definition] = [
                          raw.substring(raw.indexOf("[") + 1, raw.indexOf("]")),
                          raw.substring(raw.indexOf("]") + 1),
                        ];

                        return {
                          id: item.id,
                          uid: item.unique_id,
                          variable: item.name,
                          variable_name: item.title,
                          data_type: type,
                          definition: interpolate(definition),
                        };
                      })}
                      config={METADATA_TABLE_SCHEMA(t, dataset.type === "TABLE")}
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
              ref={ref =>
                scrollRef &&
                (scrollRef.current[
                  i18n.language === "en-GB"
                    ? "Metadata: Next update"
                    : "Metadata: Kemaskini seterusnya"
                ] = ref)
              }
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
                {metadata.source?.map(source => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
            </div>
            {/* URLs to dataset */}
            <div className="space-y-3">
              <h5>{t("meta_url")}</h5>
              <ul className="text-dim ml-6 list-outside list-disc">
                {Object.entries(metadata.url).map(([key, url]: [string, unknown]) =>
                  url ? (
                    <li key={url as string}>
                      <a
                        href={url as string}
                        className="text-primary dark:text-primary-dark break-all [text-underline-position:from-font] hover:underline"
                        onClick={() =>
                          track(key === "link_geojson" ? "csv" : (key as "parquet" | "csv"))
                        }
                      >
                        {url as string}
                      </a>
                    </li>
                  ) : undefined
                )}
              </ul>
            </div>
            {/* License */}
            <div
              className="space-y-3"
              ref={ref =>
                scrollRef &&
                (scrollRef.current[
                  i18n.language === "en-GB" ? "Metadata: License" : "Metadata: Lesen"
                ] = ref)
              }
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
