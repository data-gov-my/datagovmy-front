import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { routes } from "@lib/routes";
import {
  AgencyBadge,
  Button,
  ComboBox,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  RankList,
  Search,
  Section,
  Spinner,
  StateDropdown,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { clx, numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

/**
 * Hospital Bed Utilisation Dashboard
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Table = dynamic(() => import("datagovmy-ui/charts/table"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

type TableData = {
  data: {
    hospital: string;
    beds_nonicu: string;
    util_nonicu: string;
    beds_icu: string;
    util_icu: string;
    vent: string;
    util_vent: string;
  };
  index: number;
  state: string;
};

interface HospitalBedUtilisationProps {
  last_updated: string;
  next_update: string;
  choropleth: WithData<{
    x: string[];
    y: {
      beds_nonicu: number[];
      util_nonicu: number[];
      beds_icu: number[];
      util_icu: number[];
      vent: number[];
      util_vent: number[];
    };
  }>;
  dropdown: Array<string>;
  hospital: string;
  table_facility: WithData<Array<TableData>>;
  timeseries_facility: Record<
    "x" | "beds_nonicu" | "util_nonicu" | "beds_icu" | "util_icu" | "vent" | "util_vent",
    number[]
  >;
}

const HospitalBedUtilisation: FunctionComponent<HospitalBedUtilisationProps> = ({
  last_updated,
  next_update,
  choropleth,
  dropdown,
  hospital,
  table_facility,
  timeseries_facility,
}) => {
  const { t, i18n } = useTranslation(["dashboard-hospital-bed-utilisation", "common"]);
  const { data, setData } = useData({
    filter: "util_nonicu",
    loading: false,
  });

  const FILTER_OPTIONS: Array<OptionType> = [
    "util_nonicu",
    "util_icu",
    "util_vent",
    "beds_nonicu",
    "beds_icu",
    "vent",
  ].map((key: string) => ({
    label: t(key),
    value: key,
  }));

  const scale = (value: number) => (
    <p
      className={clx(
        value >= 75
          ? "text-red-600"
          : value < 75 && value >= 50
          ? "text-[#FF820E]"
          : value < 50 && value >= 0
          ? "text-green-600"
          : "text-inherit"
      )}
    >
      {`${value}%`}
    </p>
  );

  const HOSPITAL_OPTIONS: Array<OptionType> = dropdown.map(key => ({
    label: key,
    value: key,
  }));

  const { push } = useRouter();
  const navigateToHospital = (hospital?: string) => {
    if (!hospital) {
      setData("hospital", null);
      return;
    }
    setData("loading", true);
    setData("hospital", hospital);
    const route = `${routes.HOSPITAL_BED_UTILISATION}/${hospital}`;

    push(route, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.healthcare"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="moh" />}
        last_updated={last_updated}
        next_update={next_update}
      />
      <Container className="min-h-screen">
        {/* How does hospital bed utilisation vary nationally? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6 pb-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <Dropdown
                    anchor="left"
                    width="w-full lg:w-fit"
                    placeholder={t("common:common.select")}
                    options={FILTER_OPTIONS}
                    selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                    onChange={e => setData("filter", e.value)}
                  />
                  <p className="text-dim whitespace-pre-line">{t("choro_desc")}</p>
                </div>
                <RankList
                  id="utilisation-by-state"
                  title={t("common:common.ranking", {
                    count: choropleth.data.x.length,
                  })}
                  data={choropleth.data.y[data.filter]}
                  color="text-danger"
                  threshold={choropleth.data.x.length}
                  format={(position: number) => ({
                    label: CountryAndStates[choropleth.data.x[position]],
                    value: `${numFormat(
                      choropleth.data.y[data.filter][position],
                      "standard",
                      data.filter.startsWith("util") ? 1 : 0
                    )}${data.filter.startsWith("util") ? "%" : ""}`,
                  })}
                />
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto lg:h-[500px] lg:w-full"
                color="reds"
                data={{
                  labels: choropleth.data.x.map((state: string) => CountryAndStates[state]),
                  values: choropleth.data.y[data.filter],
                }}
                type="state"
                unit={data.filter.startsWith("util") ? "%" : ""}
              />
            }
          />
        </Section>

        {/* Hospital bed utilisation by facility */}
        <Section title={t("table_header")} date={table_facility.data_as_of}>
          <Table
            className="table-stripe lg:w-full"
            controls={setColumnFilters => (
              <>
                <StateDropdown
                  sublabel={t("common:common.state")}
                  currentState={data.table_state}
                  onChange={selected => {
                    setData("table_state", selected.value);
                    setColumnFilters([{ id: "state", value: selected.value }]);
                  }}
                  exclude={["mys"]}
                  width="w-full lg:w-64"
                />
                <Button
                  onClick={() => {
                    setData("table_state", undefined);
                    setColumnFilters([]);
                  }}
                  className="justify-end text-right text-sm text-dim"
                  disabled={!data.table_state && !data.table_district && !data.table_facility_type}
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  {t("common:common.clear_selection")}
                </Button>
              </>
            )}
            search={setGlobalFilter => (
              <Search
                className="w-full lg:w-auto"
                onChange={query => setGlobalFilter(query ?? "")}
              />
            )}
            data={table_facility.data}
            config={[
              {
                header: t("common:common.state"),
                id: "state",
                accessorKey: "state",
                enableSorting: false,
                cell: ({ getValue }) => CountryAndStates[getValue() as string],
              },
              {
                header: t("common:common.name"),
                accessorKey: "data.hospital",
                id: "data.hospital",
              },
              {
                header: t("table_beds"),
                subheader: t("table_noncrit"),
                accessorKey: "data.beds_nonicu",
                id: "beds_nonicu",
                cell: ({ getValue }) =>
                  getValue() === "None" ? "-" : numFormat(getValue(), "standard"),
                className: "text-right",
              },
              {
                header: t("table_icu"),
                subheader: t("table_crit"),
                accessorKey: "data.beds_icu",
                id: "name",
                cell: ({ getValue }) =>
                  getValue() === "None" ? "-" : numFormat(getValue(), "standard"),
                className: "text-right",
              },
              {
                header: t("table_beds_util"),
                accessorFn: (item: any) =>
                  item.data.util_nonicu && numFormat(item.data.util_nonicu, "standard", 1),
                id: "util_nonicu",
                cell: ({ getValue }) => scale(getValue()),
                className: "text-right",
              },
              {
                header: t("table_icu_util"),
                accessorFn: (item: any) =>
                  item.data.util_icu && numFormat(item.data.util_icu, "standard", 1),
                id: "util_icu",
                cell: ({ getValue }) => scale(getValue()),
                className: "text-right",
              },
            ]}
            enablePagination={10}
          />
        </Section>

        {/* Zoom into a specific facility */}
        <Section>
          <div className="flex flex-col justify-center gap-y-3 pb-8 lg:pb-12">
            <h4 className="text-center [text-wrap:balance]">{t("timeseries_header")}</h4>
            <div className="mx-auto w-full max-w-[400px]">
              <ComboBox
                placeholder={t("search_facility")}
                options={HOSPITAL_OPTIONS}
                selected={
                  data.hospital ? HOSPITAL_OPTIONS.find(e => e.value === data.hospital) : null
                }
                onChange={selected => navigateToHospital(selected?.value)}
              />
            </div>
          </div>
          <h4 className="pb-6 lg:pb-8">
            {t("timeseries_title", { facility: data.hospital ?? hospital })}
          </h4>

          {data.loading ? (
            <div className="flex h-[350px] w-full items-center justify-center">
              <Spinner loading={data.loading} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {["nonicu", "icu", "vent"].map(key => (
                <Timeseries
                  className="h-[300px] w-full"
                  title={t("timeseries", { context: key })}
                  enableGridX={false}
                  unitY="%"
                  data={{
                    labels: timeseries_facility.x,
                    datasets: [
                      {
                        type: "line",
                        label: t("util_rate"),
                        data: timeseries_facility[`util_${key}`],
                        borderColor: AKSARA_COLOR.DANGER,
                        backgroundColor: AKSARA_COLOR.DANGER_H,
                        fill: true,
                        borderWidth: 1.5,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("available"),
                      value: numFormat(
                        timeseries_facility[key === "vent" ? "vent" : `beds_${key}`].at(-1),
                        "standard"
                      ),
                    },
                    {
                      title: t("utilised"),
                      value: `${numFormat(
                        timeseries_facility[`util_${key}`].at(-1),
                        "standard",
                        1
                      )}%`,
                    },
                  ]}
                />
              ))}
            </div>
          )}
        </Section>
      </Container>
    </>
  );
};

export default HospitalBedUtilisation;
