import { FunctionComponent, MutableRefObject } from "react";
import { Button, Markdown, Section, Textarea } from "../../components";
import { useData, useTranslation } from "../../hooks";
import { CatalogueShowProps } from ".";
import CatalogueCard from "../Card";
import { clx } from "../../lib/helpers";

type MethodologyGUI =
  | {
      isGUI: true;
      scrollRef?: never;
      setMethodology: (key: string, value: any) => void;
    }
  | MethodologyDefault;

type MethodologyDefault = {
  isGUI: false;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
  setMethodology?: never;
};

type MethodologyProps = MethodologyGUI & Pick<CatalogueShowProps, "explanation">;

const DCMethodology: FunctionComponent<MethodologyProps> = ({
  scrollRef,
  explanation,
  isGUI,
  setMethodology,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);

  const { data: editGui, setData: setEditGui } = useData({
    caveat: false,
    methodology: false,
    publication: false,
  });

  return (
    <div className="dark:border-b-outlineHover-dark space-y-8 border-b py-8 lg:py-12">
      {/* How is this data produced? */}
      <Section
        title={t("header_1")}
        ref={ref =>
          scrollRef &&
          (scrollRef.current[
            i18n.language === "en-GB" ? "Metadata: Methodology" : "Metadata: Metodologi"
          ] = ref)
        }
        className=""
        description={
          <div
            className={clx(
              isGUI && "min-h-[20px] min-w-[500px] select-none",
              editGui.methodology && "flex w-full flex-col items-end gap-2"
            )}
            onDoubleClick={isGUI ? () => setEditGui("methodology", true) : () => {}}
          >
            {editGui.methodology ? (
              <>
                <Textarea
                  required
                  autoFocus
                  rows={5}
                  className="min-w-[500px]"
                  name="methodology"
                  placeholder={"[Double Click Here To Add Methodology]"}
                  value={explanation.methodology}
                  onChange={e => {
                    if (isGUI) {
                      setMethodology("methodology", e.target.value);
                    }
                  }}
                  // validation={validation.publication}
                />
                <div className="flex gap-2">
                  <Button variant="primary" onClick={() => setEditGui("methodology", false)}>
                    Ok
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (isGUI) {
                        setMethodology("methodology", "");
                      }
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </>
            ) : (
              <Markdown
                className="markdown hover:cursor-pointer"
                data-testid="catalogue-methodology"
              >
                {explanation.methodology || "[Double Click Here To Add Methodology]"}
              </Markdown>
            )}
          </div>
        }
      />

      {/* What caveats I should bear in mind when using this data? */}
      <Section
        title={t("header_2")}
        ref={ref =>
          scrollRef &&
          (scrollRef.current[i18n.language === "en-GB" ? "Metadata: Caveats" : "Metadata: Kaveat"] =
            ref)
        }
        className=""
        description={
          <div
            className={clx(
              isGUI && "min-h-[20px] min-w-[500px] select-none",
              editGui.caveat && "flex w-full flex-col items-end gap-2"
            )}
            onDoubleClick={isGUI ? () => setEditGui("caveat", true) : () => {}}
          >
            {editGui.caveat ? (
              <>
                <Textarea
                  required
                  autoFocus
                  rows={5}
                  className="min-w-[500px]"
                  name="caveat"
                  placeholder={"[Double Click Here To Add Caveat]"}
                  value={explanation.caveat}
                  onChange={e => {
                    if (isGUI) {
                      setMethodology("caveat", e.target.value);
                    }
                  }}
                  // validation={validation.publication}
                />
                <div className="flex gap-2">
                  <Button variant="primary" onClick={() => setEditGui("caveat", false)}>
                    Ok
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (isGUI) {
                        setMethodology("caveat", "");
                      }
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </>
            ) : (
              <Markdown
                className="markdown hover:cursor-pointer"
                data-testid="catalogue-methodology"
              >
                {explanation.caveat || "[Double Click Here To Add Caveat]"}
              </Markdown>
            )}
          </div>
        }
      />

      {/* Publication(s) using this data */}
      {(Boolean(explanation.publication) || isGUI) && (
        <Section
          title={t("header_3")}
          ref={ref =>
            scrollRef &&
            (scrollRef.current[
              i18n.language === "en-GB" ? "Metadata: Publications" : "Metadata: Penerbitan"
            ] = ref)
          }
          className=""
          description={
            <div
              className={clx(
                isGUI && "min-h-[20px] min-w-[500px] select-none",
                editGui.publication && "flex w-full flex-col items-end gap-2"
              )}
              onDoubleClick={isGUI ? () => setEditGui("publication", true) : () => {}}
            >
              {editGui.publication ? (
                <>
                  <Textarea
                    required
                    autoFocus
                    rows={5}
                    className="min-w-[500px]"
                    name="publication"
                    placeholder={"[Double Click Here To Add Publication]"}
                    value={explanation.publication}
                    onChange={e => {
                      if (isGUI) {
                        setMethodology("publication", e.target.value);
                      }
                    }}
                    // validation={validation.publication}
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={() => setEditGui("publication", false)}>
                      Ok
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (isGUI) {
                          setMethodology("publication", "");
                        }
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </>
              ) : (
                <Markdown
                  className="markdown hover:cursor-pointer"
                  data-testid="catalogue-publication"
                >
                  {explanation.publication! || "[Double Click Here To Add Publication]"}
                </Markdown>
              )}
            </div>
          }
        />
      )}

      {/* Related Datasets */}
      {Boolean(explanation.related_datasets.length) && (
        <Section
          title={t("header_4")}
          ref={ref =>
            scrollRef &&
            (scrollRef.current[
              i18n.language === "en-GB"
                ? "Metadata: Related Datasets"
                : "Metadata: Dataset Berkaitan"
            ] = ref)
          }
          className=""
        >
          <div className="flex h-full w-full items-start gap-[0.5rem] overflow-x-scroll pb-4">
            {explanation.related_datasets.map((item, index) => (
              <CatalogueCard
                key={index}
                dataset={{
                  id: item.id,
                  catalog_name: item.title,
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
