import { MagnifyingGlassIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { get } from "datagovmy-ui/api";
import {
  AgencyBadge,
  Button,
  Card,
  Chips,
  Container,
  Dropdown,
  Hero,
  Input,
  Radio,
  Section,
  Spinner,
  toast,
  Toggle,
  Tooltip,
} from "datagovmy-ui/components";
import { clx } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent, ReactNode } from "react";
import ComingSoon from "./coming_soon";

/**
 * Name Popularity Dashboard
 * @overview Status: Live
 */

const Bar = dynamic(() => import("datagovmy-ui/charts/bar"), { ssr: false });

interface NamePopularityDashboardProps {
  last_updated: string;
  top_names: Record<string, any>;
  yearDropdown: number[];
  ethnicityDropdown: string[];
}

const NamePopularityDashboard: FunctionComponent<NamePopularityDashboardProps> = ({
  last_updated,
  top_names,
  yearDropdown,
  ethnicityDropdown,
}) => {
  const { t } = useTranslation(["dashboard-name-popularity", "common"]);

  const { data: tableData, setData: setTableData } = useData({
    selectedEthnicity: {
      label: t(`ethnicity.${ethnicityDropdown.at(0)}`),
      value: ethnicityDropdown.at(0),
    },
    selectedYear: {
      label: t("year_format", { year: yearDropdown.at(-1) }),
      value: `${yearDropdown.at(-1)}`,
    },
  });

  const { data: searchData, setData: setSearchData } = useData({
    type: { label: t("first_name"), value: "first" },
    name: "",
    validation: false,
    params: {},
    data: null,
    loading: false,
    private: false,
  });

  const { data: compareData, setData: setCompareData } = useData({
    type: { label: t("first_name"), value: "compare_first" },
    name: "",
    names: [],
    validation: false,
    compare_name: "true",
    params: {},
    data: null,
    loading: false,
  });

  const yearOptions: OptionType[] = yearDropdown.map(val => ({
    label: t("year_format", { year: val }),
    value: val.toString(),
  }));

  const ethnicityOptions: OptionType[] = ethnicityDropdown.map(ethnicity => ({
    label: t(`ethnicity.${ethnicity}`),
    value: ethnicity,
  }));
  const { theme } = useTheme();

  const filterTypes: Array<OptionType> = [{ label: t("first_name"), value: "first" }];

  const compareFilterTypes: Array<OptionType> = [
    { label: t("first_name"), value: "compare_first" },
  ];

  const processName = (input: string): string => {
    return input
      .toLowerCase()
      .trim()
      .replace(/\b(\w)/g, (s: string) => s.toUpperCase());
  };

  const searchHandler = () => {
    const params = {
      explorer: "NAME_POPULARITY",
      name: processName(searchData.name),
      type: searchData.type.value,
      compare_name: "false",
    };
    if (!params.name.length) {
      setSearchData("validation", t("search_validation_first"));
      return;
    }
    setSearchData("loading", true);
    setSearchData("params", params);
    get("/explorer", params)
      .then(({ data }) => {
        setSearchData("data", data.data);
        setSearchData("private", data.data?.count === null);
        setSearchData("loading", false);
      })
      .catch(e => {
        if (e.response.data.error === "censored_toast")
          toast.error(t("error.censored_toast"), e.response.data.censored_names.join(","));
        else
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));

        console.error(e);
      });
  };

  const compareHandler = () => {
    // process "," for android
    if (compareData.name.includes(",")) {
      compareData.name
        .split(",")
        .map((name: string) => processName(name))
        .map((name: string) => {
          compareData.names.findIndex(
            (x: OptionType) => x.value.toLowerCase() === name.toLowerCase()
          ) === -1 && compareData.names.push({ label: name, value: name });
        });
    } else {
      const name: string = processName(compareData.name);

      if (name.length > 0) {
        compareData.names.findIndex(
          (x: OptionType) => x.value.toLowerCase() === name.toLowerCase()
        ) === -1 && compareData.names.push({ label: name, value: name });
      }
    }

    if (compareData.names.length > 1) {
      const params = {
        explorer: "NAME_POPULARITY",
        type: "first",
        name: compareData.names
          .map((name: { label: string; value: string }) => name.value)
          .join(","),
        compare_name: "true",
      };
      setCompareData("loading", true);
      setCompareData("params", params);
      get("/explorer", params)
        .then(({ data }) => {
          setCompareData("data", data.data);
          setCompareData("loading", false);
        })
        .catch(e => {
          if (e.response.data.error === "censored_toast")
            toast.error(t("error.censored_toast"), e.response.data.censored_names.join(","));
          else
            toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));

          console.error(e);
        });
    } else {
      setCompareData("validation", t("compare_validation"));
    }
    setCompareData("name", "");
  };

  const compareNameInputHandler = (e: string) => {
    const name = processName(e.split(",")[0].trim());
    if (name.length > 0) {
      compareData.names.findIndex(
        (x: OptionType) => x.value.toLowerCase() === name.toLowerCase()
      ) === -1 && compareData.names.push({ label: name, value: name });
    }
  };

  const emojiMap: Record<number, string> = {
    0: "🥇",
    1: "🥈",
    2: "🥉",
  };

  const placeholderData = {
    decade: [
      "1920s",
      "1930s",
      "1940s",
      "1950s",
      "1960s",
      "1970s",
      "1980s",
      "1990s",
      "2000s",
      "2010s",
    ],
    count: [10004, 13409, 30904, 43434, 50694, 75443, 70530, 78667, 62537, 15519],
  };

  const renderPlaceholderBar = (
    icon: ReactNode,
    prompt_key: string,
    alwaysShow: boolean = true
  ) => (
    <div
      className={clx(
        "relative h-[460px] w-full items-center justify-center",
        alwaysShow ? "flex" : "hidden lg:flex"
      )}
    >
      <Bar
        className="absolute top-0 h-[460px] w-full opacity-10"
        precision={0}
        data={{
          labels: placeholderData.decade,
          datasets: [
            {
              data: placeholderData.count,
              borderRadius: 12,
              barThickness: 12,
              backgroundColor: theme === "light" ? "#71717A" : "#FFFFFF",
            },
          ],
        }}
        enableGridX={false}
        tooltipEnabled={false}
      />
      <Card className="border-outline bg-outline dark:border-washed-dark dark:bg-washed-dark z-10 flex h-min w-fit flex-row items-center gap-2 rounded-md border px-3 py-1.5 md:mx-auto">
        {icon}
        <p>{t(prompt_key)}</p>
      </Card>
    </div>
  );

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.demography"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="jpn" />}
      />
      <Container>
        <ComingSoon />
        {/* <Section>
          <div className="space-y-6">
            <span className="flex flex-wrap justify-center gap-1.5">
              <h4 className="leading-9">{t("section1_title1")}</h4>
              <Dropdown
                className="inline-flex"
                width="w-fit"
                selected={tableData.selectedEthnicity}
                onChange={e => {
                  setTableData("selectedEthnicity", e);
                }}
                options={ethnicityOptions}
              />
              <h4 className="text-center leading-9">{t("section1_title2")}</h4>
              <Dropdown
                className="inline-flex"
                width="w-fit"
                selected={tableData.selectedYear}
                onChange={e => {
                  setTableData("selectedYear", e);
                }}
                options={yearOptions}
              />
            </span>
            <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12">
              <table className="lg:col-span-4 lg:col-start-3">
                <thead className="dark:border-washed-dark border-b-2">
                  <tr>
                    <th className="px-1 py-2 text-center text-sm font-medium">#</th>
                    <th className="px-1 py-2 text-start text-sm font-medium">
                      {t("column_male_name")}
                    </th>
                    <th className="px-1 py-2 text-end text-sm font-medium">{t("column_count")}</th>
                  </tr>
                </thead>
                <tbody>
                  {top_names[tableData.selectedYear.value][tableData.selectedEthnicity.value]
                    .filter(({ sex }: { sex: string }) => {
                      return sex === "male";
                    })
                    .map((item: { name_first: string; sex: string; count: number }, i: number) => (
                      <tr
                        key={i}
                        className={clx(
                          "dark:border-washed-dark border-b",
                          i < 3 ? "bg-background dark:bg-background-dark" : ""
                        )}
                      >
                        <td
                          className={clx(
                            "px-1 py-2 text-center text-sm font-medium",
                            i < 3 ? "text-primary dark:text-primary-dark" : ""
                          )}
                        >
                          {i + 1}
                        </td>
                        <td className="w-1/2 px-1 py-2 text-start text-sm font-medium capitalize">
                          {`${item.name_first}`}
                        </td>

                        <td className="px-1 py-2 text-end text-sm font-medium">
                          {item.count.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <table className="lg:col-span-4 lg:col-start-7">
                <thead className="dark:border-washed-dark border-b-2">
                  <tr>
                    <th className="px-1 py-2 text-center text-sm font-medium">#</th>
                    <th className="px-1 py-2 text-start text-sm font-medium">
                      {t("column_female_name")}
                    </th>
                    <th className="px-1 py-2 text-end text-sm font-medium">{t("column_count")}</th>
                  </tr>
                </thead>
                <tbody>
                  {top_names[tableData.selectedYear.value][tableData.selectedEthnicity.value]
                    .filter(({ sex }: { sex: string }) => {
                      return sex === "female";
                    })
                    .map((item: { name_first: string; sex: string; count: number }, i: number) => (
                      <tr
                        key={i}
                        className={clx(
                          "dark:border-washed-dark border-b",
                          i < 3 && "bg-background dark:bg-background-dark"
                        )}
                      >
                        <td
                          className={clx(
                            "px-1 py-2 text-center text-sm font-medium",
                            i < 3 && "text-primary dark:text-primary-dark"
                          )}
                        >
                          {i + 1}
                        </td>
                        <td className="w-1/2 px-1 py-2 text-start text-sm font-medium capitalize">
                          {`${item.name_first}`}
                        </td>
                        <td className="px-1 py-2 text-end text-sm font-medium">
                          {item.count.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>
        <Section title={t("section2_title")}>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-full lg:col-span-1">
              <Card className="border-outline bg-background dark:border-washed-dark dark:bg-washed-dark/50 shadow-button flex flex-col justify-start gap-6 rounded-xl border p-6">
                <div className="flex flex-row gap-4">
                  <span className="text-sm font-medium">{t("search_radio_label")}</span>
                  <Radio
                    name="type"
                    className="inline-flex gap-4"
                    options={filterTypes}
                    value={searchData.type}
                    onChange={e => {
                      setSearchData("type", e);
                    }}
                  />
                </div>
                <Input
                  type="search"
                  className={clx(
                    "dark:focus:border-primary-dark rounded-md border",
                    searchData.validation
                      ? "border-danger dark:border-danger border-2"
                      : "border-outline border-2 dark:border-zinc-800 dark:bg-zinc-900"
                  )}
                  placeholder={"E.g. Anwar, Siew Fook, Sivakumar"}
                  autoFocus
                  value={searchData.name}
                  onChange={e => {
                    setSearchData("validation", false);
                    setSearchData("name", e);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") searchHandler();
                  }}
                  validation={searchData.validation}
                />

                <Button
                  icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                  className="btn-primary w-fit"
                  onClick={searchHandler}
                >
                  {t("search_button")}
                </Button>

                <p className="text-dim text-sm">{t("search_details")}</p>
                <p className="text-dim text-sm">{t("search_disclaimer")}</p>
              </Card>
            </div>
            <div className="col-span-full flex max-h-fit place-content-center place-items-center lg:col-span-2">
              {searchData.data ? (
                <div className="w-full">
                  {searchData.loading ? (
                    <div className="flex h-[460px] items-center justify-center">
                      <Spinner loading={searchData.loading} />
                    </div>
                  ) : searchData.private ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-lg font-bold">
                          <span>
                            {t(`bar_title_${searchData.params.type}`, {
                              count: searchData.data.total || 0,
                            })}
                          </span>
                          <span>{`"${searchData.params.name}".`}</span>
                        </p>
                        <p className="text-dim text-sm">
                          <span>
                            {t("bar_description", {
                              name: searchData.params.name,
                            })}
                          </span>
                        </p>
                      </div>
                      {renderPlaceholderBar(
                        <LockClosedIcon className="h-4 w-4" />,
                        t("privacy_prompt")
                      )}
                    </div>
                  ) : (
                    <Bar
                      precision={0}
                      suggestedMaxY={5}
                      className="h-[460px]"
                      title={
                        <>
                          <p className="text-lg font-bold">
                            <span>
                              {t(`bar_title_${searchData.params.type}`, {
                                count: searchData.data.total || 0,
                              })}
                            </span>
                            <span>{`"${searchData.params.name}".`}</span>
                          </p>
                          <p className="text-dim text-sm">
                            <span>
                              {t("bar_description", {
                                name: searchData.params.name,
                              })}
                            </span>
                          </p>
                        </>
                      }
                      data={{
                        labels: searchData.data.decade
                          ? searchData.data.decade.map((x: string) => t("year_format", { year: x }))
                          : placeholderData.decade,
                        datasets: [
                          {
                            data: searchData.data.count,
                            label: t("similar_names"),
                            borderRadius: 12,
                            barThickness: 12,
                            backgroundColor: theme === "light" ? "#18181B" : "#FFFFFF",
                          },
                        ],
                      }}
                      enableGridX={false}
                    />
                  )}
                </div>
              ) : (
                renderPlaceholderBar(
                  <MagnifyingGlassIcon className="h-4 w-4" />,
                  "search_prompt",
                  false
                )
              )}
            </div>
          </div>
        </Section>
        <Section title={t("section3_title")}>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-full lg:col-span-1">
              <Card className="border-outline bg-background dark:border-washed-dark dark:bg-washed-dark/50 shadow-button flex flex-col	justify-start gap-6 rounded-xl border p-6">
                <div className="flex flex-col justify-start gap-3">
                  <div className="flex flex-col gap-4">
                    <span className="text-sm font-medium">{t("compare_radio")}</span>
                    <Radio
                      name="compare_type"
                      className="inline-flex gap-4"
                      options={compareFilterTypes}
                      value={compareData.type}
                      onChange={e => {
                        setCompareData("type", e);
                      }}
                    />
                  </div>
                  <Input
                    type="search"
                    disabled={compareData.names.length > 9}
                    className={clx(
                      "dark:focus:border-primary-dark rounded-md border",
                      compareData.validation
                        ? "border-danger dark:border-danger border-2"
                        : compareData.names.length > 9
                        ? "border-outline bg-outline text-dim border opacity-30 dark:border-black dark:bg-black"
                        : "border-outline border-2 dark:border-zinc-800 dark:bg-zinc-900"
                    )}
                    placeholder={"E.g. Anwar, Siew Fook, Sivakumar"}
                    value={compareData.name}
                    onChange={e => {
                      setCompareData("validation", false);
                      setCompareData("name", e !== "," ? e : "");
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        compareHandler();
                      } else if (e.key === ",") {
                        compareNameInputHandler((e.target as HTMLInputElement).value);
                        setCompareData("name", "");
                      } else {
                        setCompareData("validation", false);
                      }
                    }}
                    validation={compareData.validation}
                  />
                  {compareData.names.length > 0 && (
                    <Chips
                      data={compareData.names}
                      onRemove={s => {
                        setCompareData(
                          "names",
                          compareData.names.filter((item: OptionType) => s !== item.value)
                        );
                      }}
                      onClearAll={() => setCompareData("names", [])}
                    />
                  )}
                </div>
                <div>
                  <Button
                    icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                    className="btn-primary"
                    onClick={compareHandler}
                  >
                    {t("compare_button")}
                  </Button>
                </div>
                <p className="text-dim text-sm">{t("search_details")}</p>
                <p className="text-dim text-sm">{t("search_disclaimer")}</p>
              </Card>
            </div>

            <div
              className={clx(
                "col-span-full flex min-h-[460px] flex-col gap-3 lg:col-span-2",
                compareData.data ?? "hidden lg:flex"
              )}
            >
              {compareData.loading ? (
                <div className="flex h-[300px] items-center justify-center">
                  <Spinner loading={searchData.loading} />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                    <p className="text-lg font-bold">
                      <span>{t("compare_title")}</span>
                    </p>
                    <Toggle
                      enabled={false}
                      onStateChanged={checked => setCompareData("order", checked)}
                      label={t("compare_toggle")}
                    />
                  </div>

                  <table className="w-full table-fixed border-collapse">
                    <thead>
                      <tr className="md:text-md border-b-outline dark:border-washed-dark max-w-full border-b-2 text-left text-sm [&>*]:p-2">
                        <th className="w-5 md:w-[50px]">#</th>
                        <th>{t("first_name")}</th>
                        <th>{t("table_total")}</th>
                        <th>{t("table_most_popular")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareData.data ? (
                        compareData.data
                          .sort((a: { total: number }, b: { total: number }) =>
                            a.total == 0
                              ? Number.MIN_VALUE
                              : compareData.order
                              ? b.total - a.total
                              : a.total - b.total
                          )
                          .map(
                            (
                              item: { name: string; total: number; max: string; min: string },
                              i: number
                            ) => (
                              <tr
                                key={item.name}
                                className={clx(
                                  i < Math.min(3, compareData.data.length - 1)
                                    ? "bg-background dark:border-washed-dark dark:bg-washed-dark/50"
                                    : "",
                                  "md:text-md text-sm"
                                )}
                              >
                                <td
                                  className={clx(
                                    "border-b-outline dark:border-washed-dark border-b p-2",
                                    i < Math.min(3, compareData.data.length - 1)
                                      ? "text-primary dark:text-primary-dark"
                                      : ""
                                  )}
                                >
                                  {i + 1}
                                </td>
                                <td className="border-b-outline dark:border-washed-dark truncate border-b p-2 capitalize">
                                  {`${item.name} `.concat(
                                    i < Math.min(3, compareData.data.length - 1) ? emojiMap[i] : ""
                                  )}
                                </td>
                                <td className="border-b-outline dark:border-washed-dark border-b p-2">
                                  {item.total.toLocaleString("en-US")}
                                </td>
                                <td className="border-b-outline dark:border-washed-dark border-b p-2">
                                  {item.max ? (
                                    t("year_format", { year: item.max })
                                  ) : item.total === 0 ? (
                                    "N/A"
                                  ) : (
                                    <div className="flex">
                                      <Tooltip tip={t("privacy_prompt2")}>
                                        {open => (
                                          <div
                                            className="cursor-help whitespace-nowrap underline decoration-dashed [text-underline-position:from-font]"
                                            onClick={open}
                                          >
                                            <LockClosedIcon className="h-4 w-4" />
                                          </div>
                                        )}
                                      </Tooltip>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )
                          )
                      ) : compareData.isLoading ? (
                        <tr>
                          <td colSpan={5}>
                            <div className="grid place-items-center py-3">
                              <Spinner loading={compareData.isLoading} />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <Card className="border-outline bg-outline dark:border-washed-dark dark:bg-washed-dark my-3 hidden w-fit flex-row items-center gap-2 rounded-md border px-3 py-1.5 md:mx-auto lg:flex">
                              <MagnifyingGlassIcon className=" h-4 w-4" />
                              <p>{t("compare_prompt")}</p>
                            </Card>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </Section> */}
      </Container>
    </>
  );
};

export default NamePopularityDashboard;
