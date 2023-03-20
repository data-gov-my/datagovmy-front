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

/**
 * Name Popularity Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface NamePopularityDashboardProps {
  // data: { name: string; total: number; decade: number[]; count: number[] };
  query: any;
  name: string;
  type: string;
  total: number;
  decade: number[];
  count: number[];
}

const NamePopularityDashboard: FunctionComponent<NamePopularityDashboardProps> = ({
  query,
  name,
  type,
  total,
  decade,
  count,
}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-name-popularity"]);

  const { data, setData } = useData({
    type: { label: "First Name", value: "first" },
    name: "",
    validation: false,
  });

  const filterTypes: Array<OptionType> = [
    { label: "First Name", value: "first" },
    { label: "Surname", value: "last" },
  ];

  const { filter, setFilter, actives } = useFilter({
    type: query.type,
    name: query.name,
  });

  const { theme } = useTheme();

  const searchHandler = () => {
    const name: string = data.name.trim().toLowerCase();
    if (name.length > 0) {
      setFilter("type", data.type);
      setFilter("name", name);
    } else {
      setData("validation", true);
    }
  };

  return (
    <>
      <Hero
        background="bg-gradient-radial border-b dark:border-zinc-800 from-[#A1BFFF] to-background dark:from-outlineHover-dark dark:to-black"
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
                    value={data.type}
                    onChange={e => {
                      setData("type", e);
                    }}
                  />
                </div>
                <Input
                  type="search"
                  className="rounded-md border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="E.g. Anwar, Siew Fook, Sivakumar"
                  autoFocus
                  value={data.name}
                  onChange={e => {
                    setData("validation", false);
                    setData("name", e);
                  }}
                  isValidation={data.validation}
                  validationText={`Please enter your ${data.type.value} name`}
                />
                <div className="">
                  <Button
                    icon={<MagnifyingGlassIcon className=" h-4 w-4" />}
                    className="btn btn-primary"
                    onClick={searchHandler}
                  >
                    Search Name
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
              className={"col-span-full flex place-content-center place-items-center lg:col-span-2"}
            >
              {query.name && query.type ? (
                total ? (
                  <div className="w-full">
                    <Timeseries
                      title={
                        <>
                          <p className="text-lg font-bold">
                            <span>
                              {t("dashboard-name-popularity:bar_title", {
                                total: total || 0,
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
                      interval="year"
                      data={{
                        labels: decade,
                        datasets: [
                          {
                            type: "bar",
                            label: `${t("Similar names")}`,
                            data: count,
                            backgroundColor:
                              theme === "light" ? "rgba(113, 113, 122, 0.3)" : "#3F3F46",
                          },
                        ],
                      }}
                      enableGridX={false}
                      enableGridY={true}
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
      </Container>
    </>
  );
};

export default NamePopularityDashboard;
