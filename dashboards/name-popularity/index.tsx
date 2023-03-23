import { FunctionComponent } from "react";
import { Button, Container, Hero, Input, Radio, Section } from "@components/index";
import dynamic from "next/dynamic";
import { useTranslation } from "@hooks/useTranslation";
import AgencyBadge from "@components/AgencyBadge";
import { JabatanPendaftaranNegaraIcon } from "@components/Icon";
import Card from "@components/Card";
import { useData } from "@hooks/useData";
import { OptionType } from "@components/types";
import { useFilter } from "@hooks/useFilter";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";
import Empty from "@components/Chart/Empty";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import Chips from "@components/Chips";

/**
 * Name Popularity Dashboard
 * @overview Status: Live
 */

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

interface NamePopularityDashboardProps {
  // data: { name: string; total: number; decade: number[]; count: number[] };
  query: any;
  data: any;
}

const NamePopularityDashboard: FunctionComponent<NamePopularityDashboardProps> = ({
  query,
  data,
}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-name-popularity"]);

  const { data: searchData, setData: setSearchData } = useData({
    type: { label: "First Name", value: "first" },
    name: "",
    validation: false,
  });

  const { data: compareData, setData: setCompareData } = useData({
    type: { label: "First Name", value: "compare_first" },
    name: "",
    validation: false,
    compare_name: "true",
    names: [],
  });

  const filterTypes: Array<OptionType> = [
    { label: "First Name", value: "first" },
    { label: "Surname", value: "last" },
  ];

  const compareFilterTypes: Array<OptionType> = [
    { label: "First Name", value: "compare_first" },
    { label: "Surname", value: "compare_last" },
  ];

  const { filter, setFilter, actives } = useFilter({
    type: query.type,
    name: query.name,
    compare_name: query.compare_name,
  });

  const { theme } = useTheme();

  const searchHandler = () => {
    const name: string = searchData.name.trim().replace(/\b(\w)/g, (s: string) => s.toUpperCase());
    if (name.length > 0) {
      setFilter("type", searchData.type);
      setFilter("name", name);
      setFilter("compare_name", "false");
    } else {
      setSearchData("validation", `Please enter your ${searchData.type.value} name`);
    }
  };

  const compareHandler = () => {
    const name: string = compareData.name.trim().replace(/\b(\w)/g, (s: string) => s.toUpperCase());

    if (compareData.names.length > 1) {
      if (name.length > 0) {
        compareData.names.findIndex(
          (x: OptionType) => x.value.toLowerCase() === name.toLowerCase()
        ) === -1 && compareData.names.push({ label: name, value: name });
      }
      setFilter("type", compareData.type.value === "compare_first" ? "first" : "last");
      setFilter(
        "name",
        compareData.names.map((name: { label: string; value: string }) => name.value).join(",")
      );
      setCompareData("name", "");
      setFilter("compare_name", "true");
    } else {
      setCompareData("validation", "Please enter more than one name for comparison");
    }
  };

  const compareNameInputHandler = (e: string) => {
    const name = e.split(",")[0].replace(/\b(\w)/g, s => s.toUpperCase());

    if (name.length > 0) {
      compareData.names.findIndex(
        (x: OptionType) => x.value.toLowerCase() === name.toLowerCase()
      ) === -1 && compareData.names.push({ label: name, value: name });
    } else {
      setCompareData(
        "validation",
        `Please enter your ${compareData.type.value === "compare_last" ? "last" : "first"} name`
      );
    }
  };

  const emojiMap: Record<number, string> = {
    0: "🥇",
    1: "🥈",
    2: "🥉",
  };

  return (
    <>
      <Hero
        background="bg-gradient-radial border-b dark:border-zinc-800 from-[#A1BFFF] to-background dark:from-[#203053] dark:to-black"
        category={[t("nav.megamenu.categories.demography"), "text-primary"]}
        header={[t("dashboard-name-popularity:header")]}
        description={[t("dashboard-name-popularity:description")]}
        agencyBadge={
          <AgencyBadge
            agency="Jabatan Pendaftaran Negara"
            link="https://www.jpn.gov.my/en/"
            icon={<JabatanPendaftaranNegaraIcon />}
          />
        }
      />
      <Container className="min-h-screen">
        <Section>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-full lg:col-span-1">
              <Card className="flex flex-col justify-start gap-6 rounded-xl border border-slate-200	bg-slate-50 p-6 shadow dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex flex-row gap-4">
                  <span className="text-sm font-medium">Search For: </span>
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
                  className={"rounded-md border dark:focus:border-primary-dark".concat(
                    searchData.validation
                      ? " border-2 border-danger dark:border-danger"
                      : " border-2 border-slate-200 dark:border-zinc-800 dark:bg-zinc-900"
                  )}
                  placeholder={
                    searchData.type.value === "last"
                      ? "E.g. Ibrahim, Loke, Veerapan"
                      : "E.g. Anwar, Siew Fook, Sivakumar"
                  }
                  autoFocus
                  value={searchData.name}
                  onChange={e => {
                    setSearchData("validation", false);
                    setSearchData("name", e);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") searchHandler();
                  }}
                  isValidation={searchData.validation}
                  validationText={`Please enter your ${searchData.type.value} name`}
                />
                <div className="">
                  <Button
                    icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                    className="btn btn-primary"
                    onClick={searchHandler}
                  >
                    {t("dashboard-name-popularity:search_button")}
                  </Button>
                </div>
                <p className="text-sm text-dim">
                  {
                    "The data behind this dashboard does not contain any full names. You can only search for your first name (e.g. Anwar, Azizah) "
                  }
                  <span className="font-bold">or</span>
                  {" your surname (e.g. Loke, Veerapan)."}
                </p>
                <p className="text-sm text-dim">
                  {"We do not store your input - only you can see your search."}
                </p>
              </Card>
            </div>
            <div
              className={
                "col-span-full flex h-[460px] place-content-center place-items-center lg:col-span-2"
              }
            >
              {query.name && query.type && query.compare_name !== "true" ? (
                data.total ? (
                  <div className="w-full">
                    <Bar
                      precision={0}
                      suggestedMaxY={10}
                      className="h-[460px]"
                      title={
                        <>
                          <p className="text-lg font-bold">
                            <span>
                              {t("dashboard-name-popularity:bar_title", {
                                count: data.total || 0,
                                type: query.type,
                              })}
                            </span>
                            <span className="capitalize">{`"${query.name}".`}</span>
                          </p>
                          <p className="text-sm text-dim">
                            Here’s how many newborns were named{" "}
                            <span className="capitalize">{query.name}</span> over the years:
                          </p>
                        </>
                      }
                      data={{
                        labels: data.decade.map((x: number) => x.toString().concat("s")),
                        datasets: [
                          {
                            data: data.count,
                            label: "Similar names",
                            borderRadius: 12,
                            barThickness: 12,
                            backgroundColor: theme === "light" ? "#18181B" : "#FFFFFF",
                          },
                        ],
                      }}
                      enableGridX={false}
                      // precision={0}
                      // minY={0}
                      // maxY={Math.max(10, ...(data.count + 5))}
                    />
                  </div>
                ) : (
                  <div className="flex h-fit w-fit items-center gap-2 rounded-md bg-slate-200 p-3 text-center text-sm dark:bg-zinc-800">
                    <FaceFrownIcon className="h-4 w-4" />
                    {t("dashboard-name-popularity:validation_text", {
                      name: query.name,
                      type: query.type,
                    })}
                  </div>
                )
              ) : (
                // <Empty
                // type="timeseries"
                // placeholder={
                <div className="flex h-fit w-fit items-center gap-2 rounded-md bg-slate-200 p-3 text-center text-sm dark:bg-zinc-800">
                  <MagnifyingGlassIcon className=" h-4 w-4" />
                  {t("dashboard-name-popularity:search_prompt")}
                </div>
                // }
                // />
              )}
            </div>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-full lg:col-span-1">
              <Card className="flex flex-col justify-start gap-6 rounded-xl border border-slate-200	bg-slate-50 p-6 shadow dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="flex flex-col gap-4">
                  <span className="text-sm font-medium">
                    {t("dashboard-name-popularity:compare_radio")}
                  </span>
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
                  disabled={compareData.names.length > 7}
                  className={"rounded-md border dark:focus:border-primary-dark".concat(
                    compareData.validation
                      ? " border-2 border-danger dark:border-danger"
                      : compareData.names.length > 7
                      ? " border border-outline bg-outline/50 text-dim"
                      : " border-2 border-slate-200 dark:border-zinc-800 dark:bg-zinc-900"
                  )}
                  placeholder={
                    compareData.type.value === "last"
                      ? "E.g. Ibrahim, Loke, Veerapan"
                      : "E.g. Anwar, Siew Fook, Sivakumar"
                  }
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
                  isValidation={compareData.validation}
                  validationText={compareData.validation}
                />
                <Chips
                  data={compareData.names}
                  onRemove={s => {
                    setCompareData(
                      "names",
                      compareData.names.filter((item: OptionType) => s !== item.value)
                    );
                  }}
                  onClearAll={() => setCompareData("names", [])}
                ></Chips>
                <div className="">
                  <Button
                    icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                    className="btn btn-primary"
                    onClick={compareHandler}
                  >
                    {t("dashboard-name-popularity:compare_button")}
                  </Button>
                </div>

                <p className="text-sm text-dim">
                  {"We do not store your input - only you can see your search."}
                </p>
              </Card>
            </div>

            <div className="col-span-full h-[460px] lg:col-span-2">
              <table className="w-full table-auto border-collapse md:table-fixed ">
                <thead>
                  <tr className="md:text-md border-b-2 border-b-outline text-left text-sm dark:border-zinc-800 [&>*]:p-2">
                    <th className="md:w-[50px]">#</th>
                    <th>{t("dashboard-name-popularity:table_name")}</th>
                    <th>{t("dashboard-name-popularity:table_total")}</th>
                    <th>{t("dashboard-name-popularity:table_most_popular")}</th>
                    <th>{t("dashboard-name-popularity:table_least_popular")}</th>
                  </tr>
                </thead>
                <tbody>
                  {query.compare_name === "true" &&
                    data
                      .sort((a: { total: number }, b: { total: number }) => a.total - b.total)
                      .map(
                        (
                          item: { name: string; total: number; max: number; min: number },
                          i: number
                        ) => (
                          <tr
                            className={(i < Math.min(3, data.length - 1)
                              ? "bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800/50"
                              : ""
                            ).concat(" md:text-md text-sm")}
                          >
                            <td className="border-b border-b-outline p-2 dark:border-zinc-800">
                              {i + 1}
                            </td>
                            <td className="border-b border-b-outline p-2 capitalize dark:border-zinc-800">
                              {`${item.name} `.concat(
                                i < Math.min(3, data.length - 1) ? emojiMap[i] : ""
                              )}
                            </td>
                            <td className="border-b border-b-outline p-2 dark:border-zinc-800">
                              {item.total}
                            </td>
                            <td className="border-b border-b-outline p-2 dark:border-zinc-800">
                              {item.max}
                            </td>
                            <td className="border-b border-b-outline p-2 dark:border-zinc-800">
                              {item.min}
                            </td>
                          </tr>
                        )
                      )}
                </tbody>
              </table>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default NamePopularityDashboard;
