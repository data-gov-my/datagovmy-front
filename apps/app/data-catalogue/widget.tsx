import { OptionType } from "@components/types";
import {
  DocumentArrowDownIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
} from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { SHORT_PERIOD, SHORT_PERIOD_FORMAT } from "./utils";
import { clx, download, interpolate, numFormat, toDate } from "@lib/helpers";
import type {
  DCChartKeys,
  DCConfig,
  DownloadOption,
  DownloadOptions,
  FilterDefault,
} from "@lib/types";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import Card from "@components/Card";
import Slider from "@components/Chart/Slider";
import Container from "@components/Container";
import { useFilter } from "@hooks/useFilter";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useAnalytics } from "@hooks/useAnalytics";
import sum from "lodash/sum";
import { WindowProvider } from "@hooks/useWindow";
import Section from "@components/Section";
import Tooltip from "@components/Tooltip";

/**
 * Catalogue Show
 * @overview Status: Live
 */

const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const CatalogueTimeseries = dynamic(() => import("@data-catalogue/partials/timeseries"), {
  ssr: false,
});
const CatalogueChoropleth = dynamic(() => import("@data-catalogue/partials/choropleth"), {
  ssr: false,
});
const CatalogueGeoChoropleth = dynamic(() => import("@data-catalogue/partials/geochoropleth"), {
  ssr: false,
});
const CatalogueScatter = dynamic(() => import("@data-catalogue/partials/scatter"), {
  ssr: false,
});
const CatalogueMapPlot = dynamic(() => import("@data-catalogue/partials/mapplot"), {
  ssr: false,
});
const CatalogueGeojson = dynamic(() => import("@data-catalogue/partials/geojson"), {
  ssr: false,
});
const CatalogueBar = dynamic(() => import("@data-catalogue/partials/bar"), {
  ssr: false,
});
const CataloguePyramid = dynamic(() => import("@data-catalogue/partials/pyramid"), {
  ssr: false,
});
const CatalogueHeatmap = dynamic(() => import("@data-catalogue/partials/heatmap"), {
  ssr: false,
});
const CatalogueLine = dynamic(() => import("@data-catalogue/partials/line"), {
  ssr: false,
});

interface CatalogueShowProps {
  options: OptionType[];
  params: {
    id: string;
  };
  config: DCConfig;
  dataset: {
    type: DCChartKeys;
    chart: any;
    table: Record<string, any>[];
    meta: { title: string; desc: string; unique_id: string };
  };
  explanation: { caveat: string; methodology: string; publication?: string };
  metadata: {
    data_as_of: string;
    url: {
      csv?: string;
      parquet?: string;
      [key: string]: string | undefined;
    };
    source: string[];
    definitions: Array<{
      id: number;
      unique_id?: string;
      name: string;
      desc: string;
      title: string;
    }>;
    next_update: string;
    description: string;
    last_updated: string;
  };
  urls: {
    [key: string]: string;
  };
  translations: {
    [key: string]: string;
  };
}

const CatalogueShow: FunctionComponent<CatalogueShowProps> = ({
  options,
  params,
  config,
  dataset,
  explanation,
  metadata,
  urls,
  translations,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const [show, setShow] = useState<OptionType>(options[0]);
  const [downloads, setDownloads] = useState<DownloadOptions>({ chart: [], data: [] });
  const { filter, setFilter } = useFilter(config.context, { id: params.id });
  const { result, track } = useAnalytics(dataset);

  const renderChart = (): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
      case "STACKED_AREA":
        return (
          <CatalogueTimeseries
            className="h-full w-full"
            config={config}
            dataset={dataset}
            filter={filter}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "CHOROPLETH":
        return (
          <CatalogueChoropleth
            dataset={dataset}
            urls={urls}
            config={config}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "GEOCHOROPLETH":
        return (
          <CatalogueGeoChoropleth
            dataset={dataset}
            urls={urls}
            config={config}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "GEOPOINT":
        return (
          <CatalogueMapPlot dataset={dataset} urls={urls} onDownload={prop => setDownloads(prop)} />
        );
      case "GEOJSON":
        return (
          <CatalogueGeojson
            config={config}
            dataset={dataset}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "BAR":
      case "HBAR":
      case "STACKED_BAR":
        return (
          <WindowProvider>
            <CatalogueBar
              className="h-[75vh] w-[100vw]"
              config={config}
              dataset={dataset}
              urls={urls}
              translations={translations}
              onDownload={prop => setDownloads(prop)}
            />
          </WindowProvider>
        );
      case "PYRAMID":
        return (
          <CataloguePyramid
            config={config}
            dataset={dataset}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "HEATTABLE":
        return (
          <CatalogueHeatmap
            config={config}
            dataset={dataset}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "SCATTER":
        return (
          <CatalogueScatter
            className="mx-auto aspect-square w-full lg:h-[512px] lg:w-1/2"
            dataset={dataset}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "LINE":
        return (
          <CatalogueLine
            config={config}
            dataset={dataset}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      default:
        break;
    }
    return;
  };

  useEffect(() => {
    if (dataset.type === "TABLE") {
      setDownloads({
        chart: [],
        data: [
          {
            id: "csv",
            image: "/static/images/icons/csv.png",
            title: t("csv.title"),
            description: t("csv.desc"),
            icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
            href() {
              download(urls.csv, dataset.meta.unique_id.concat(".csv"));
              track("csv");
            },
          },
          {
            id: "parquet",
            image: "/static/images/icons/parquet.png",
            title: t("parquet.title"),
            description: t("parquet.desc"),
            icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
            href() {
              download(urls.csv, dataset.meta.unique_id.concat(".parquet"));
              track("parquet");
            },
          },
        ],
      });
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-row items-center justify-start gap-2 md:justify-between">
          <h4 className="inline-block truncate" data-testid="catalogue-title">
            {dataset.meta.title}
          </h4>

          <Tooltip
            className="block md:hidden"
            tip={t("common:common.data_of", {
              date: toDate(metadata.data_as_of, "dd MMM yyyy", i18n.language),
            })}
          />
          <span className="text-dim hidden text-right text-sm md:block">
            {t("common:common.data_of", {
              date: toDate(metadata.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </span>
        </div>

        {/* Chart */}
        {renderChart()}
      </div>
      {/* Date Slider (optional) */}
      {config.dates !== null && (
        <Slider
          className="pt-4"
          type="single"
          value={config.dates?.options.indexOf(
            filter[config.dates.key].value ?? config.dates.default
          )}
          data={config.dates.options}
          period={SHORT_PERIOD[config.dates.interval]}
          onChange={e =>
            config.dates !== null && setFilter(config.dates.key, config.dates.options[e])
          }
        />
      )}
      {/* </Section> */}

      <div className="bg-washed absolute bottom-0 flex w-full gap-2 px-3 py-1">
        <Image src="/static/images/logo.png" width={16} height={14} alt="datagovmy logo" />
        <small className="text-dim space-x-2 ">
          {/* <a
            href={`https://data.gov.my/data-catalogue/${dataset.meta.unique_id}`}
            target="_blank"
            className="space-x-1 hover:underline"
          >
            <span>{dataset.meta.title}</span>
            <ExternalLinkIcon className="inline-block h-3 w-3" />
          </a>

          <span>|</span> */}
          <span>
            Data widget by{" "}
            <a href="https://data.gov.my" className="text-primary">
              data.gov.my
            </a>
          </span>
        </small>
      </div>
    </div>
  );
};

export default CatalogueShow;
