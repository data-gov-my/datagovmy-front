import { FunctionComponent, MutableRefObject, useContext } from "react";
import {
  Card,
  Section,
  Tooltip,
  Dropdown,
  Textarea,
  Button,
  Input,
  Label,
  Skeleton,
} from "../../components";
import { useAnalytics, useTranslation } from "../../hooks";
import { clx, interpolate, toDate } from "../../lib/helpers";
import Table from "../../charts/table";
import { METADATA_TABLE_SCHEMA } from "../../lib/schema/data-catalogue";
import { DCVariable } from "../../../types/data-catalogue";
import { CatalogueContext } from "../../contexts/catalogue";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon } from "@heroicons/react/20/solid";
import { PencilIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { DateTime } from "luxon";

type MetadataGUI =
  | {
      isGUI: true;
      scrollRef?: never;
      setMetadata: (key: string, value: any, index?: number) => void;
      edit: any;
      setEdit: (key: string, value: boolean) => void;
      validation?: any;
      setValidation: (key: string, value: any) => void;
      toggleIndex?: number;
    }
  | MetadataDefault;

type MetadataDefault = {
  isGUI: false;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
  setMetadata?: never;
  validation?: never;
  setValidation?: never;
  edit?: never;
  setEdit?: never;
  toggleIndex?: never;
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
  selectedEdition: string | undefined;
  setSelectedEdition: (edition: string) => void;
};

const DCMetadata: FunctionComponent<MetadataProps> = ({
  isGUI,
  edit,
  setEdit,
  scrollRef,
  setMetadata,
  metadata,
  selectedEdition,
  setSelectedEdition,
  validation,
  setValidation,
  toggleIndex,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const { dataset } = useContext(CatalogueContext);
  const { track } = useAnalytics(dataset);

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
        className={clx(
          "dark:border-b-outlineHover-dark mx-auto border-b py-8 lg:py-12",
          isGUI && "border-b-0"
        )}
      >
        <Card className="bg-background dark:border-outlineHover-dark dark:bg-washed-dark p-6">
          <div className="space-y-6">
            {/* Dataset description */}
            <div className="space-y-3">
              <h5>{t("meta_desc")}</h5>
              {edit?.edit_description2 ? (
                <div className="group relative flex w-full flex-col items-center justify-center gap-2">
                  <Textarea
                    required
                    rows={3}
                    autoFocus
                    className={clx(
                      "w-full py-1.5",
                      validation &&
                        toggleIndex !== undefined &&
                        (toggleIndex === 0 ? validation.description_en : validation.description_ms)
                        ? "border-danger border-2"
                        : "border-outline dark:border-washed-dark"
                    )}
                    name="description"
                    placeholder={"[Add description text]"}
                    value={metadata.description}
                    onChange={e => {
                      if (isGUI) {
                        setMetadata("description", e.target.value);
                        setValidation(
                          toggleIndex === 0 ? "description_en" : "description_ms",
                          false
                        );
                      }
                    }}
                  />
                  <div className="absolute -bottom-10 right-0 z-10 flex w-fit items-center gap-2">
                    <div className="border-outline shadow-floating dark:border-washed-dark flex items-center gap-[3px] overflow-hidden rounded-lg border">
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowUpIcon className="size-5 " />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_publication", true);
                            setEdit("edit_description2", false);
                          }
                        }}
                      />
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowDownIcon className="size-5" />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_description2", false);
                            setEdit("edit_fields", true);
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="default"
                      className="size-8 justify-center p-1"
                      onClick={() => isGUI && setEdit("edit_description2", false)}
                      icon={<CheckIcon className="text-success size-5" />}
                    />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() =>
                    isGUI && !edit.ai_draft && setEdit && setEdit("edit_description2", true)
                  }
                  className={clx(
                    "group relative",
                    isGUI && "hover:border-b-primary  w-full hover:rounded-sm hover:border",
                    isGUI && edit.ai_draft && "hover:border-0"
                  )}
                >
                  {isGUI && edit.ai_draft ? (
                    <div className="space-y-1">
                      <Skeleton />
                      <Skeleton />
                      <Skeleton className="w-1/2" />
                    </div>
                  ) : (
                    <>
                      <p className={clx("text-dim leading-relaxed", isGUI && "min-h-[72px]")}>
                        {interpolate(metadata.description)}
                      </p>
                      {isGUI && (
                        <Button
                          variant={
                            validation &&
                            toggleIndex !== undefined &&
                            (toggleIndex === 0
                              ? validation.description_en
                              : validation.description_ms)
                              ? "ghost"
                              : "default"
                          }
                          className={clx("absolute -right-[72px] top-0 size-8 justify-center p-1")}
                          icon={
                            validation &&
                            toggleIndex !== undefined &&
                            (toggleIndex === 0
                              ? validation.description_en
                              : validation.description_ms) ? (
                              <ExclamationTriangleIcon className="text-danger size-5" />
                            ) : (
                              <PencilIcon className="size-5" />
                            )
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-3">
              {/* Variable definitions */}
              {edit?.edit_fields ? (
                <div className="group relative">
                  <h5>{t("meta_def")}</h5>
                  <div className="absolute -bottom-0 -right-0 z-10 flex w-fit items-center gap-2">
                    <div className="border-outline shadow-floating dark:border-washed-dark flex items-center gap-[3px] overflow-hidden rounded-lg border">
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowUpIcon className="size-5" />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_description2", true);
                            setEdit("edit_fields", false);
                          }
                        }}
                      />
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowDownIcon className="size-5" />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_fields", false);
                            setEdit("edit_last_updated", true);
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="default"
                      className="size-8 justify-center p-1"
                      onClick={() => isGUI && setEdit("edit_fields", false)}
                      icon={<CheckIcon className="text-success size-5" />}
                    />
                  </div>
                </div>
              ) : (
                <div className="group relative w-full">
                  <h5>{t("meta_def")}</h5>
                  {isGUI && !edit.ai_draft && (
                    <Button
                      onClick={() => setEdit("edit_fields", true)}
                      variant={
                        validation &&
                        toggleIndex !== undefined &&
                        validation.fields &&
                        !validation.fields?.every((f: any) =>
                          toggleIndex === 0
                            ? !f["title_en"] && !f["description_en"]
                            : !f["title_ms"] && !f["description_ms"]
                        )
                          ? "ghost"
                          : "default"
                      }
                      className={clx("absolute -right-[72px] top-0 size-8 justify-center p-1")}
                      icon={
                        validation &&
                        toggleIndex !== undefined &&
                        validation.fields &&
                        !validation.fields?.every((f: any) =>
                          toggleIndex === 0
                            ? !f["title_en"] && !f["description_en"]
                            : !f["title_ms"] && !f["description_ms"]
                        ) ? (
                          <ExclamationTriangleIcon className="text-danger size-5" />
                        ) : (
                          <PencilIcon className="size-5" />
                        )
                      }
                    />
                  )}
                </div>
              )}
              {edit?.edit_fields
                ? metadata.fields?.length > 0 && (
                    <div className="space-y-3">
                      {metadata.fields.map((field, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4">
                          <div className="col-span-3">
                            <Input
                              className="w-full"
                              required
                              label={t("meta_variable_name")}
                              value={field.name}
                              readOnly
                            />
                          </div>
                          <div className="col-span-3">
                            <Input
                              label={t("meta_variable")}
                              required
                              className="w-full"
                              value={field.title}
                              onChange={e => isGUI && setMetadata("fields.title", e, index)}
                              validation={
                                validation.fields[index][
                                  toggleIndex === 0 ? "title_en" : "title_ms"
                                ]
                              }
                            />
                          </div>
                          <div className="col-span-6 space-y-2">
                            <Label
                              label={t("meta_definition")}
                              name={t("meta_definition")}
                              required={true}
                            />
                            <Textarea
                              className={clx(
                                "w-full",
                                validation.fields[index][
                                  toggleIndex === 0 ? "description_en" : "description_ms"
                                ] && "border-danger border-2"
                              )}
                              rows={3}
                              value={field.description}
                              onChange={e =>
                                isGUI && setMetadata("fields.description", e.target.value, index)
                              }
                            />
                            <p className="text-danger text-xs">
                              {
                                validation.fields[index][
                                  toggleIndex === 0 ? "description_en" : "description_ms"
                                ]
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                : metadata.fields?.length > 0 && (
                    <>
                      <ul className="text-dim ml-6 list-outside list-disc md:hidden">
                        {metadata.fields?.map(item => (
                          <li key={item.name}>
                            <span className="flex gap-x-1">
                              {item.title}
                              <Tooltip tip={interpolate(item.description)} />
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="hidden md:block">
                        {isGUI && edit.ai_draft ? (
                          <>
                            {metadata.fields.map((field, index) => (
                              <div key={index} className="grid grid-cols-12 gap-4">
                                <div className="col-span-3 py-1">
                                  <Skeleton />
                                </div>
                                <div className="col-span-3 py-1">
                                  <Skeleton />
                                </div>
                                <div className="col-span-6 py-1">
                                  <Skeleton />
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
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
                        )}
                      </div>
                    </>
                  )}
            </div>
            {/* Last updated */}
            <div className="space-y-3">
              <h5>{t("common:common.last_updated", { date: "" })}</h5>
              {edit?.edit_last_updated ? (
                <div className="group relative flex w-full flex-col items-center justify-center gap-2">
                  <Input
                    required
                    autoFocus
                    type={"datetime-local"}
                    className={clx(
                      "w-fit py-1.5",
                      validation && toggleIndex !== undefined && validation.last_updated
                        ? "border-danger border-2"
                        : "border-outline dark:border-washed-dark"
                    )}
                    name="last_updated"
                    value={DateTime.fromSQL(metadata.last_updated).toFormat("yyyy-MM-dd'T'HH:mm")}
                    onChange={e => {
                      if (isGUI) {
                        setMetadata("last_updated", DateTime.fromISO(e).toSQL());
                        setValidation("last_updated", false);
                      }
                    }}
                  />

                  <div className="absolute -bottom-0 right-0 z-10 flex w-fit items-center gap-2">
                    <div className="border-outline shadow-floating dark:border-washed-dark flex items-center gap-[3px] overflow-hidden rounded-lg border">
                      <Button
                        className="size-8 justify-center p-1"
                        icon={<ArrowUpIcon className="size-5" />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_last_updated", false);
                            setEdit("edit_fields", true);
                          }
                        }}
                      />
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowDownIcon className="size-5" />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_last_updated", false);
                            setEdit("edit_next_update", true);
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="default"
                      className="size-8 justify-center p-1"
                      onClick={() => isGUI && setEdit("edit_last_updated", false)}
                      icon={<CheckIcon className="text-success size-5" />}
                    />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() =>
                    isGUI && !edit.ai_draft && setEdit && setEdit("edit_last_updated", true)
                  }
                  className={clx(
                    "group relative",
                    isGUI && "hover:border-b-primary  w-full hover:rounded-sm hover:border",
                    isGUI && edit.ai_draft && "hover:border-0"
                  )}
                >
                  {isGUI && edit.ai_draft ? (
                    <div className="space-y-1">
                      <Skeleton />
                    </div>
                  ) : (
                    <>
                      <p
                        className="text-dim whitespace-pre-line"
                        data-testid="catalogue-last-updated"
                      >
                        {toDate(metadata.last_updated, "dd MMM yyyy, HH:mm", i18n.language)}
                      </p>
                      {isGUI && (
                        <Button
                          variant={validation && validation.last_updated ? "ghost" : "default"}
                          className={clx("absolute -right-[72px] top-0 size-8 justify-center p-1")}
                          icon={
                            validation && validation.last_updated ? (
                              <ExclamationTriangleIcon className="text-danger size-5" />
                            ) : (
                              <PencilIcon className="size-5" />
                            )
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              )}
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
              {edit?.edit_next_update ? (
                <div className="group relative flex w-full flex-col items-center justify-center gap-2">
                  <Input
                    required
                    autoFocus
                    type={"datetime-local"}
                    className={clx(
                      "w-fit py-1.5",
                      validation && validation.next_update
                        ? "border-danger border-2"
                        : "border-outline dark:border-washed-dark"
                    )}
                    name="next_update"
                    value={DateTime.fromSQL(metadata.next_update).toFormat("yyyy-MM-dd'T'HH:mm")}
                    onChange={e => {
                      if (isGUI) {
                        setMetadata("next_update", DateTime.fromISO(e).toSQL());
                        setValidation("next_update", false);
                      }
                    }}
                  />

                  <div className="absolute -bottom-0 right-0 z-10 flex w-fit items-center gap-2">
                    <div className="border-outline shadow-floating dark:border-washed-dark flex items-center gap-[3px] overflow-hidden rounded-lg border">
                      <Button
                        className="size-8 justify-center p-1"
                        icon={<ArrowUpIcon className="size-5" />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_next_update", false);
                            setEdit("edit_last_updated", true);
                          }
                        }}
                      />
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowDownIcon className="size-5" />}
                        disabled
                      />
                    </div>
                    <Button
                      variant="default"
                      className="size-8 justify-center p-1"
                      onClick={() => isGUI && setEdit("edit_next_update", false)}
                      icon={<CheckIcon className="text-success size-5" />}
                    />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() =>
                    isGUI && !edit.ai_draft && setEdit && setEdit("edit_next_update", true)
                  }
                  className={clx(
                    "group relative",
                    isGUI && "hover:border-b-primary  w-full hover:rounded-sm hover:border",
                    isGUI && edit.ai_draft && "hover:border-0"
                  )}
                >
                  {isGUI && edit.ai_draft ? (
                    <div className="space-y-1">
                      <Skeleton />
                    </div>
                  ) : (
                    <>
                      <p className="text-dim" data-testid="catalogue-next-update">
                        {toDate(metadata.next_update, "dd MMM yyyy, HH:mm", i18n.language)}
                      </p>
                      {isGUI && (
                        <Button
                          variant={validation && validation.next_update ? "ghost" : "default"}
                          className={clx("absolute -right-[72px] top-0 size-8 justify-center p-1")}
                          icon={
                            validation && validation.next_update ? (
                              <ExclamationTriangleIcon className="text-danger size-5" />
                            ) : (
                              <PencilIcon className="size-5" />
                            )
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              )}
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
              {metadata.link_editions && metadata.link_editions.length > 0 && (
                <Dropdown
                  options={metadata.link_editions.map(edition => ({
                    label: edition,
                    value: edition,
                  }))}
                  selected={
                    selectedEdition ? { label: selectedEdition, value: selectedEdition } : undefined
                  }
                  onChange={selected => setSelectedEdition(selected.value as string)}
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
                }).map(([key, url]: [string, string]) =>
                  url ? (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-primary-dark break-all [text-underline-position:from-font] hover:underline"
                        onClick={() =>
                          // TODO: Refactor GeoJSON analytics
                          track(key === "link_geojson" ? "parquet" : (key as "parquet" | "csv"))
                        }
                      >
                        {url}
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
