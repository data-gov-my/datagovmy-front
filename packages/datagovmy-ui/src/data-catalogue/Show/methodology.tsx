import { FunctionComponent, MutableRefObject } from "react";
import { Button, Markdown, Section, Textarea } from "../../components";
import { useTranslation } from "../../hooks";
import CatalogueCard from "../Card";
import { clx } from "../../lib/helpers";
import { DCVariable } from "../../../types/data-catalogue";
import { PencilIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon } from "@heroicons/react/20/solid";

type MethodologyGUI =
  | {
      isGUI: true;
      scrollRef?: never;
      setMethodology: (key: string, value: string) => void;
      edit: any;
      setEdit: (key: string, value: boolean) => void;
      validation?: any;
      setValidation: (key: string, value: any) => void;
      toggleIndex?: number;
    }
  | MethodologyDefault;

type MethodologyDefault = {
  isGUI: false;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
  setMethodology?: never;
  validation?: never;
  setValidation?: never;
  edit?: never;
  setEdit?: never;
  toggleIndex?: never;
};

type MethodologyProps = MethodologyGUI & {
  explanation: Pick<DCVariable, "methodology" | "caveat" | "publication" | "related_datasets">;
};

const DCMethodology: FunctionComponent<MethodologyProps> = ({
  scrollRef,
  explanation,
  isGUI,
  setMethodology,
  edit,
  setEdit,
  validation,
  setValidation,
  toggleIndex,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);

  return (
    <div className="dark:border-b-outlineHover-dark space-y-8 border-b py-8 lg:py-12">
      {/* How is this data produced? */}
      <Section
        title={t("header_1")}
        ref={ref => {
          scrollRef &&
            (scrollRef.current[
              i18n.language === "en-GB" ? "Metadata: Methodology" : "Metadata: Metodologi"
            ] = ref);
        }}
        className=""
        description={
          <div
            className={clx(
              isGUI && "min-h-[20px] w-full min-w-[500px] select-none",
              edit?.edit_methodology && "flex w-full flex-col items-end gap-2"
            )}
          >
            {edit?.edit_methodology ? (
              <div className="group relative flex w-full flex-col items-start gap-2">
                <Textarea
                  required
                  autoFocus
                  rows={8}
                  className={clx(
                    "w-full py-1.5",
                    (toggleIndex === 0 ? validation.methodology_en : validation.methodology_ms)
                      ? "border-danger border-2"
                      : "border-outline dark:border-washed-dark"
                  )}
                  name="methodology"
                  placeholder={"[Add methodology text]"}
                  value={explanation.methodology}
                  onChange={e => {
                    if (isGUI) {
                      setMethodology("methodology", e.target.value);
                      setValidation(toggleIndex === 0 ? "methodology_en" : "methodology_ms", false);
                    }
                  }}
                />
                <div className="bg-background dark:bg-washed-dark dark:border-washed-dark mt-4 w-full rounded-md border p-4">
                  <p className="text-dim mb-2 text-sm">Markdown Preview:</p>
                  <Markdown className="markdown">
                    {explanation.methodology || "[Add methodology text]"}
                  </Markdown>
                </div>
                <div className="absolute -bottom-10 right-0 z-10 flex w-fit items-center gap-2">
                  <div className="border-outline shadow-floating dark:border-washed-dark flex items-center gap-[3px] overflow-hidden rounded-lg border">
                    <Button
                      className="hover:bg-washed size-8 justify-center p-1"
                      icon={<ArrowUpIcon className="size-5 text-black dark:text-white" />}
                      onClick={() => {
                        if (isGUI) {
                          setEdit("edit_description", true);
                          setEdit("edit_methodology", false);
                        }
                      }}
                    />
                    <Button
                      className="hover:bg-washed size-8 justify-center p-1"
                      icon={<ArrowDownIcon className="size-5 text-black dark:text-white" />}
                      onClick={() => {
                        if (isGUI) {
                          setEdit("edit_methodology", false);
                          setEdit("edit_caveat", true);
                        }
                      }}
                    />
                  </div>
                  <Button
                    variant="default"
                    className="size-8 justify-center p-1"
                    onClick={() => isGUI && setEdit("edit_methodology", false)}
                    icon={<CheckIcon className="text-success size-5" />}
                  />
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEdit && setEdit("edit_methodology", true)}
                className={clx(
                  "group relative",
                  isGUI && "hover:border-b-primary  w-full hover:rounded-sm hover:border"
                )}
              >
                <Markdown className="markdown" data-testid="catalogue-methodology">
                  {explanation.methodology || "[Click on the button to add methodology]"}
                </Markdown>
                {isGUI && (
                  <Button
                    variant={
                      validation &&
                      toggleIndex !== undefined &&
                      (toggleIndex === 0 ? validation.methodology_en : validation.methodology_ms)
                        ? "ghost"
                        : "default"
                    }
                    className={clx("absolute -right-12 top-0 size-8 justify-center p-1")}
                    icon={
                      validation &&
                      toggleIndex !== undefined &&
                      (toggleIndex === 0
                        ? validation.methodology_en
                        : validation.methodology_ms) ? (
                        <ExclamationTriangleIcon className="text-danger size-5" />
                      ) : (
                        <PencilIcon className="size-5" />
                      )
                    }
                  />
                )}
              </div>
            )}
          </div>
        }
      />

      {/* What caveats I should bear in mind when using this data? */}
      {(Boolean(explanation.caveat.length > 3) || isGUI) && (
        <Section
          title={t("header_2")}
          ref={ref => {
            scrollRef &&
              (scrollRef.current[
                i18n.language === "en-GB" ? "Metadata: Caveats" : "Metadata: Kaveat"
              ] = ref);
          }}
          className=""
          description={
            <div
              className={clx(
                isGUI && "min-h-[20px] w-full min-w-[500px] select-none",
                edit?.edit_caveat && "flex w-full flex-col items-end gap-2"
              )}
            >
              {edit?.edit_caveat ? (
                <div className="group relative flex w-full flex-col items-start gap-2">
                  <Textarea
                    required
                    autoFocus
                    rows={8}
                    className={clx(
                      "w-full py-1.5",
                      validation &&
                        toggleIndex !== undefined &&
                        (toggleIndex === 0 ? validation.caveat_en : validation.caveat_ms)
                        ? "border-danger border-2"
                        : "border-outline dark:border-washed-dark"
                    )}
                    name="caveat"
                    placeholder={"[Add caveat text]"}
                    value={explanation.caveat}
                    onChange={e => {
                      if (isGUI) {
                        setMethodology("caveat", e.target.value);
                        setValidation(toggleIndex === 0 ? "caveat_en" : "caveat_ms", false);
                      }
                    }}
                  />
                  <div className="bg-background dark:bg-washed-dark dark:border-washed-dark mt-4 w-full rounded-md border p-4">
                    <p className="text-dim mb-2 text-sm">Markdown Preview:</p>
                    <Markdown className="markdown">
                      {explanation.caveat || "[Add caveat text]"}
                    </Markdown>
                  </div>
                  <div className="absolute -bottom-10 right-0 z-10 flex w-fit items-center gap-2">
                    <div className="border-outline shadow-floating dark:border-washed-dark flex items-center gap-[3px] overflow-hidden rounded-lg border">
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowUpIcon className="size-5 text-black dark:text-white" />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_methodology", true);
                            setEdit("edit_caveat", false);
                          }
                        }}
                      />
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowDownIcon className="size-5 text-black dark:text-white" />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_caveat", false);
                            setEdit("edit_publication", true);
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="default"
                      className="size-8 justify-center p-1"
                      onClick={() => isGUI && setEdit("edit_caveat", false)}
                      icon={<CheckIcon className="text-success size-5" />}
                    />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEdit && setEdit("edit_caveat", true)}
                  className={clx(
                    "group relative",
                    isGUI && "hover:border-b-primary  w-full hover:rounded-sm hover:border"
                  )}
                >
                  <Markdown className="markdown" data-testid="catalogue-caveat">
                    {explanation.caveat || "[Click on the button to add caveat]"}
                  </Markdown>
                  {isGUI && (
                    <Button
                      variant={
                        validation &&
                        toggleIndex !== undefined &&
                        (toggleIndex === 0 ? validation.caveat_en : validation.caveat_ms)
                          ? "ghost"
                          : "default"
                      }
                      className={clx("absolute -right-12 top-0 size-8 justify-center p-1")}
                      icon={
                        validation &&
                        toggleIndex !== undefined &&
                        (toggleIndex === 0 ? validation.caveat_en : validation.caveat_ms) ? (
                          <ExclamationTriangleIcon className="text-danger size-5" />
                        ) : (
                          <PencilIcon className="size-5" />
                        )
                      }
                    />
                  )}
                </div>
              )}
            </div>
          }
        />
      )}
      {/* Publication(s) using this data */}
      {(Boolean(
        typeof explanation.publication === "string"
          ? explanation.publication.length > 3
          : explanation.publication
      ) ||
        isGUI) && (
        <Section
          title={t("header_3")}
          ref={ref => {
            scrollRef &&
              (scrollRef.current[
                i18n.language === "en-GB" ? "Metadata: Publications" : "Metadata: Penerbitan"
              ] = ref);
          }}
          className=""
          description={
            <div
              className={clx(
                isGUI && "min-h-[20px] w-full min-w-[500px] select-none",
                edit?.edit_publication && "flex w-full flex-col items-end gap-2"
              )}
            >
              {edit?.edit_publication ? (
                <div className="group relative flex w-full flex-col items-start gap-2">
                  <Textarea
                    required
                    autoFocus
                    rows={8}
                    className={clx(
                      "w-full py-1.5",
                      validation &&
                        toggleIndex !== undefined &&
                        (toggleIndex === 0 ? validation.publication_en : validation.publication_ms)
                        ? "border-danger border-2"
                        : "border-outline dark:border-washed-dark"
                    )}
                    name="publication"
                    placeholder={"[Add publication text]"}
                    value={explanation.publication}
                    onChange={e => {
                      if (isGUI) {
                        setMethodology("publication", e.target.value);
                        setValidation(
                          toggleIndex === 0 ? "publication_en" : "publication_ms",
                          false
                        );
                      }
                    }}
                  />
                  <div className="bg-background dark:bg-washed-dark dark:border-washed-dark mt-4 w-full rounded-md border p-4">
                    <p className="text-dim mb-2 text-sm">Markdown Preview:</p>
                    <Markdown className="markdown">
                      {explanation.publication || "[Add publication text]"}
                    </Markdown>
                  </div>
                  <div className="absolute -bottom-10 right-0 z-10 flex w-fit items-center gap-2">
                    <div className="border-outline shadow-floating dark:border-washed-dark flex items-center gap-[3px] overflow-hidden rounded-lg border">
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowUpIcon className="size-5 text-black dark:text-white" />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_caveat", true);
                            setEdit("edit_publication", false);
                          }
                        }}
                      />
                      <Button
                        className="hover:bg-washed size-8 justify-center p-1"
                        icon={<ArrowDownIcon className="size-5 text-black dark:text-white" />}
                        onClick={() => {
                          if (isGUI) {
                            setEdit("edit_publication", false);
                            setEdit("edit_description2", true);
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="default"
                      className="size-8 justify-center p-1"
                      onClick={() => isGUI && setEdit("edit_publication", false)}
                      icon={<CheckIcon className="text-success size-5" />}
                    />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEdit && setEdit("edit_publication", true)}
                  className={clx(
                    "group relative",
                    isGUI && "hover:border-b-primary  w-full hover:rounded-sm hover:border"
                  )}
                >
                  <Markdown className="markdown" data-testid="catalogue-publication">
                    {explanation.publication! || "[Click on the button to add publication]"}
                  </Markdown>
                  {isGUI && (
                    <Button
                      variant={
                        validation &&
                        toggleIndex !== undefined &&
                        (toggleIndex === 0 ? validation.publication_en : validation.publication_ms)
                          ? "ghost"
                          : "default"
                      }
                      className={clx("absolute -right-12 top-0 size-8 justify-center p-1")}
                      icon={
                        validation &&
                        toggleIndex !== undefined &&
                        (toggleIndex === 0
                          ? validation.publication_en
                          : validation.publication_ms) ? (
                          <ExclamationTriangleIcon className="text-danger size-5" />
                        ) : (
                          <PencilIcon className="size-5" />
                        )
                      }
                    />
                  )}
                </div>
              )}
            </div>
          }
        />
      )}

      {/* Related Datasets */}
      {Boolean(explanation.related_datasets.length) && (
        <Section
          title={t("header_4")}
          ref={ref => {
            scrollRef &&
              (scrollRef.current[
                i18n.language === "en-GB"
                  ? "Metadata: Related Datasets"
                  : "Metadata: Dataset Berkaitan"
              ] = ref);
          }}
          className=""
        >
          <div className="flex h-full w-full items-start gap-[0.5rem] overflow-x-scroll pb-4">
            {explanation.related_datasets.map((item, index) => (
              <CatalogueCard
                key={index}
                dataset={{
                  id: item.id,
                  title: item.title,
                  description: item.description,
                }}
                index={index}
                alternateStyle={true}
                width="md:min-w-[calc(100%_/_3.25-0.5rem)] md:w-[calc(100%_/_3.25-0.5rem)] w-full"
              />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default DCMethodology;
