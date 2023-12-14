import { FunctionComponent, MutableRefObject } from "react";
import { Markdown, Section } from "../../components";
import { useTranslation } from "../../hooks";
import { CatalogueShowProps } from ".";
import CatalogueCard from "../Card";

type MethodologyGUI =
  | {
      isGUI: true;
      scrollRef?: never;
    }
  | MethodologyDefault;

type MethodologyDefault = {
  isGUI: false;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
};

type MethodologyProps = MethodologyGUI & Pick<CatalogueShowProps, "explanation">;

const DCMethodology: FunctionComponent<MethodologyProps> = ({ scrollRef, explanation, isGUI }) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);

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
          <div className="select-none" onDoubleClick={() => console.log("yeah")}>
            <Markdown className="markdown" data-testid="catalogue-methodology">
              {explanation.methodology}
            </Markdown>
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
          <Markdown className="markdown" data-testid="catalogue-methodology">
            {explanation.caveat}
          </Markdown>
        }
      />

      {/* Publication(s) using this data */}
      {Boolean(explanation.publication) && (
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
            <Markdown className="markdown" data-testid="catalogue-publication">
              {explanation.publication!}
            </Markdown>
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
