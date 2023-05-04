import {
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import Card from "@components/Card";
import ComboBox from "@components/Combobox";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import ImageWithFallback from "@components/ImageWithFallback";
import {
  AgencyBadge,
  Button,
  Container,
  Dropdown,
  Hero,
  Modal,
  Section,
  StateDropdown,
  Tabs,
  Tooltip,
} from "@components/index";
import Label from "@components/Label";
import LeftRightCard from "@components/LeftRightCard";
import { List, Panel } from "@components/Tabs";
import ContainerTabs from "@components/Tabs/ContainerTabs";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import {
  BuildingLibraryIcon,
  FlagIcon,
  MapIcon,
  TableCellsIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { BREAKPOINTS, CountryAndStates, PoliticalPartyColours } from "@lib/constants";
import { get } from "@lib/api";
import { clx, numFormat } from "@lib/helpers";
import { routes } from "@lib/routes";
import { useFilter } from "@hooks/useFilter";
import Carousel from "@components/Carousel";
import Slider from "react-slick";
import { BarMeter, FullResult, Lost, Result, Won } from "@components/Chart/Table/BorderlessTable";
import { DateTime } from "luxon";
import ElectionCard from "@components/Card/ElectionCard";
import { WindowContext } from "@hooks/useWindow";

/**
 * Election Explorer Dashboard
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Waffle = dynamic(() => import("@components/Chart/Waffle"), { ssr: false });
interface ElectionExplorerProps {
  election: any;
  query: any;
}

const ElectionExplorer: FunctionComponent<ElectionExplorerProps> = ({ election, query }) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);

  const sliderRef = useRef<Slider>(null);
  const [hasShadow, setHasShadow] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const { breakpoint, scroll } = useContext(WindowContext);
  const show = useMemo(() => scroll.y > 400, [scroll.y]);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const handleScroll = () => {
      setHasShadow(div.getBoundingClientRect().top === 64);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [divRef]);

  const results: { [key: string]: ReactNode } = {
    won: <Won desc={t("candidate.won")} />,
    won_uncontested: <Won desc={t("candidate.won_uncontested")} />,
    lost: <Lost desc={t("candidate.lost")} />,
    lost_deposit: <Lost desc={t("candidate.lost_deposit")} />,
  };

  const PANELS = [
    {
      name: t("election.parliament"),
      icon: <BuildingLibraryIcon className="mr-1 h-5 w-5" />,
    },
    {
      name: t("election.state"),
      icon: <FlagIcon className="mr-1 h-5 w-5" />,
    },
  ];

  const ELECTION_OPTIONS: Array<OptionType> = [...Array(16)].map((n, index: number) => ({
    label: `GE-${String(index).padStart(2, "0")}`,
    value: `GE-${String(index).padStart(2, "0")}`,
  }));

  const FILTER_OPTIONS: Array<OptionType> = [
    "voter_turnout",
    "majority_%",
    "rejected_votes",
    "%_PH",
    "num_voters",
  ].map((key: string) => ({
    label: t(`election.${key}`),
    value: key,
  }));

  const waffleDummy = [
    {
      id: "PH",
      label: "PH",
      value: 82,
    },
    {
      id: "BN",
      label: "BN",
      value: 30,
    },
    {
      id: "PN",
      label: "PN",
      value: 74,
    },
    {
      id: "GPS",
      label: "GPS",
      value: 23,
    },
    {
      id: "Others",
      label: "Others",
      value: 13,
    },
  ];

  const waffleColours = ["#e2462f", "#000080", "#003152", "#FF9B0E", "#E2E8F0"];

  const { data, setData } = useData({
    tabs: 0,
    tabs_section1: 0,
    tabs_section3: 0,

    type: query.type ? query.type : "parlimen",
    state: query.state ? query.state : "pls",
    election: query.election ? query.election : ELECTION_OPTIONS.at(-1)?.value,
    section1_loading: false,

    // Placeholder for Combobox
    p_seat: "",
    seats_list: [],

    // query
    q_seat: query.seat ? query.seat : "",
    section2_loading: false,
    data: election,
    open: false,
    index: 0,
    result: [],

    filter: FILTER_OPTIONS[0],
    section3_loading: false,
  });

  const { setFilter } = useFilter({
    election: query.election,
    seat: query.seat,
    state: query.state,
    type: query.type,
  });

  const SEAT_OPTIONS: Array<OptionType> =
    data.seats_list &&
    data.seats_list.map((key: string) => ({
      label: key,
      value: key,
    }));

  // useEffect(() => {
  //   sliderRef.current?.slickGoTo(data.index);
  // }, [data.index]);

  useEffect(() => {
    setData("q_seat", SEAT_OPTIONS[0] ? SEAT_OPTIONS[0].value : "P.001 Padang Besar, Perlis");
  }, [data.seats_list]);

  // useEffect(() => {
  //   get("/explorer", {
  //     explorer: "ELECTIONS",
  //     dropdown: "seats_list",
  //   }).then(({ data }) => {
  //     setData("seats_list", data);
  //   });
  // }, []);

  useEffect(() => {
    setData("section2_loading", true);
    setFilter("election", data.election);
    setFilter("type", data.type);
    setFilter("state", data.state);
    setFilter("seat", data.q_seat);
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "overall_seat",
      election: data.election,
      type: data.type,
      state: data.state,
    })
      .then(({ data }) => {
        setData("data", data);
        setData(
          "seats_list",
          data.map((d: any) => d.seat)
        );
      })
      .then(() => setData("section2_loading", false));
  }, [data.q_seat, data.state, data.election, data.type]);

  useEffect(() => {
    setData("section2_loading", true);
    setFilter("seat", data.q_seat);
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "full_result",
      type: "seats",
      election: data.election,
      seat: data.seats_list[data.index],
    })
      .then(({ data }) => {
        setData(
          "result",
          data.sort((a: Result, b: Result) => b.votes.abs - a.votes.abs)
        );
      })
      .then(() => setData("section2_loading", false));
  }, [data.index, data.open]);
  // const topStateIndices = getTopIndices(choropleth.data.y.perc, 3, true);

  return (
    <>
      <Hero
        background="red"
        category={[t("common:nav.megamenu.categories.democracy"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Election Comission (EC)"}
            link="https://www.spr.gov.my/"
            icon={<SPRIcon />}
          />
        }
      />

      <Container className="min-h-fit">
        <ContainerTabs.List
          options={[
            {
              name: t("elections"),
              icon: <SPRIconSolid className="-mb-1" />,
            },
            {
              name: t("candidates"),
              icon: <UserIcon className="m-1 h-5 w-5" />,
              url: routes.ELECTION_EXPLORER.concat("/candidates"),
            },
            {
              name: t("parties"),
              icon: <FlagIcon className="m-1 h-5 w-5" />,
              url: routes.ELECTION_EXPLORER.concat("/parties"),
            },
            {
              name: t("seats"),
              icon: <MapIcon className="m-1 h-5 w-5" />,
              url: routes.ELECTION_EXPLORER.concat("/seats"),
            },
          ]}
          current={0}
        />

        <Section>
          <h4 className="text-center">{t("election.section_1")}</h4>
          <div className={clx(show ? "fixed right-0 top-16 z-10 lg:hidden" : "hidden")}>
            <Modal
              trigger={open => (
                <Button
                  onClick={open}
                  className="border-outline bg-background dark:border-outlineHover-dark dark:bg-washed-dark dark:shadow-washed-dark mr-3 block self-center border px-3 py-1.5 shadow-lg"
                >
                  <span>{t("common:catalogue.filter")}:</span>
                  <span className="bg-primary dark:bg-primary-dark rounded-md px-1 py-0.5 text-xs text-white">
                    {3}
                  </span>
                </Button>
              )}
              title={
                <Label
                  label={t("common:catalogue.filter") + ":"}
                  className="block text-sm font-bold text-black dark:text-white"
                />
              }
            >
              {close => (
                <div className="flex-grow space-y-4 overflow-y-auto pb-24 pt-4">
                  <Label
                    label={t("election.election") + ":"}
                    className="block text-sm font-medium text-black dark:text-white"
                  />
                  <div className="border-outline dark:border-washed-dark max-w-fit rounded-full border bg-white p-1 dark:bg-black">
                    <List
                      options={PANELS.map(item => item.name)}
                      icons={PANELS.map(item => item.icon)}
                      current={data.tabs}
                      onChange={index => setData("tabs", index)}
                    />
                  </div>
                  <div className="dark:border-outlineHover-dark grid grid-cols-2 gap-2 border-y py-4">
                    <Label
                      label={t("election.state") + ":"}
                      className="block text-sm font-medium text-black dark:text-white"
                    />
                    <Label
                      label={t("election.election_year") + ":"}
                      className="block text-sm font-medium text-black dark:text-white"
                    />
                    <StateDropdown
                      currentState={data.state}
                      onChange={selected => setData("state", selected.value)}
                      exclude={["mys", "kul", "lbn", "pjy"]}
                      width="w-full"
                      anchor="left"
                      // disabled={data.tabs === 0}
                    />
                    <Dropdown
                      width="w-full"
                      placeholder={t("common:common.select")}
                      options={ELECTION_OPTIONS}
                      selected={ELECTION_OPTIONS.find(e => e.value === data.election)}
                      onChange={e => setData("election", e.value)}
                    />
                  </div>
                  <div className="fixed bottom-0 left-0 flex w-full flex-col gap-2 bg-white px-2 py-3 dark:bg-black">
                    <Button className="btn btn-primary w-full justify-center" onClick={close}>
                      {t("election.apply_filters")}
                    </Button>
                    <Button className="btn btn-default w-full justify-center" onClick={close}>
                      {t("common:common.close")}
                    </Button>
                  </div>
                </div>
              )}
            </Modal>
          </div>
          <div
            ref={divRef}
            className={clx(
              "sticky top-16 z-10 mt-6 hidden items-center justify-center gap-2 lg:flex lg:pl-2",
              hasShadow ? "drop-shadow-xl" : "drop-shadow-none"
            )}
          >
            <div
              className={clx(
                "border-outline dark:border-washed-dark max-w-fit rounded-full border bg-white p-1 dark:bg-black",
                hasShadow ? "shadow-lg dark:shadow-neutral-700" : "shadow-none"
              )}
            >
              <List
                options={PANELS.map(item => item.name)}
                icons={PANELS.map(item => item.icon)}
                current={data.tabs}
                onChange={index => setData("tabs", index)}
              />
            </div>
            <StateDropdown
              shadow={clx(hasShadow ? "shadow-lg dark:shadow-neutral-700" : "shadow-none")}
              currentState={data.state}
              onChange={selected => setData("state", selected.value)}
              exclude={["mys", "kul", "lbn", "pjy"]}
              width="min-w-max"
              anchor="left"
              // disabled={data.tabs === 0}
            />
            <Dropdown
              shadow={clx(hasShadow ? "shadow-lg dark:shadow-neutral-700" : "shadow-none")}
              anchor="left"
              width="max-w-fit"
              options={ELECTION_OPTIONS}
              selected={ELECTION_OPTIONS.find(e => e.value === data.election)}
              onChange={e => setData("election", e.value)}
            />
          </div>
          <Tabs hidden current={data.tabs} onChange={index => setData("tabs", index)}>
            {PANELS.map((panel, index) => (
              <Tabs.Panel name={panel.name as string} icon={panel.icon} key={index}>
                <div className="py-12 lg:grid lg:grid-cols-12">
                  <div className="space-y-6 lg:col-span-10 lg:col-start-2">
                    <Tabs
                      title={
                        <div className="text-base font-bold">
                          {t("election.parliament_of")}
                          <span className="text-primary">
                            {data.tabs === 1 && data.state
                              ? CountryAndStates[data.state]
                              : CountryAndStates["mys"]}
                          </span>
                          <span>: </span>
                          <span className="text-primary">{data.election}</span>
                        </div>
                      }
                      current={data.tabs_section1}
                      onChange={index => setData("tabs_section1", index)}
                    >
                      <Panel name={t("election.map")} icon={<MapIcon className="mr-1 h-5 w-5" />}>
                        <Card className="border-outline dark:border-washed-dark bg-background dark:bg-background-dark static rounded-xl border xl:py-4">
                          <Choropleth
                            enableOutline={false}
                            type={data.tabs === 1 ? "dun" : "parlimen"}
                          />
                        </Card>
                      </Panel>
                      <Panel
                        name={t("election.table")}
                        icon={<TableCellsIcon className="mr-1 h-5 w-5" />}
                      >
                        <BorderlessTable isLoading={data.section1_loading} data={data.data} />
                      </Panel>
                      <Panel name={t("election.summary")}>
                        <div className="space-y-6">
                          <p className="text-center text-sm font-medium">
                            {t("election.majority")}
                          </p>
                          <div className="relative h-12 w-full">
                            <Waffle
                              className="h-[50px] min-h-max w-full"
                              fillDirection={"left"}
                              data={waffleDummy}
                              margin={{ top: 0, right: 0, bottom: 0, left: 2 }}
                              total={222}
                              rows={3}
                              cols={74}
                              color={waffleColours}
                            />
                            <hr className="border-background-dark absolute inset-x-1/2 -top-3 h-[72px] w-0 border border-dashed dark:border-white"></hr>
                          </div>
                          <div className="text-dim flex flex-row flex-wrap items-center justify-center gap-6">
                            {waffleDummy.map(({ label, value }) => (
                              <div className="flex flex-row items-center gap-1">
                                {label === "Others" ? (
                                  <div className="bg-dim h-4 w-7 rounded-md"></div>
                                ) : (
                                  <ImageWithFallback
                                    src={`/static/images/parties/${label}.png`}
                                    width={28}
                                    height={16}
                                    alt={t(`${label}`)}
                                  />
                                )}
                                <span
                                  className="uppercase"
                                  style={{ color: PoliticalPartyColours[label] }}
                                >
                                  {label}
                                </span>
                                <span
                                  className="font-bold"
                                  style={{ color: PoliticalPartyColours[label] }}
                                >
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-dim whitespace-pre-line text-center text-sm ">
                            {t("election.explore")}
                          </p>
                        </div>
                      </Panel>
                    </Tabs>
                  </div>
                </div>
              </Tabs.Panel>
            ))}
          </Tabs>
          <div className="dark:border-t-outlineHover-dark border-t py-12 lg:grid lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-10 lg:col-start-2">
              <div className="space-y-6">
                <h4 className="text-center">{t("election.section_2")}</h4>
                <div className="grid grid-cols-12 lg:grid-cols-10">
                  <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-4">
                    <ComboBox
                      placeholder={t("election.search_area")}
                      options={SEAT_OPTIONS}
                      selected={
                        data.p_seat ? SEAT_OPTIONS.find(e => e.value === data.p_seat.value) : null
                      }
                      onChange={e => {
                        if (e) {
                          setData("q_seat", e.value);
                          setData(
                            "index",
                            // sliderRef.current?.slickGoTo(
                            data.seats_list.findIndex((seat: string) => seat === e.value)
                          );
                        }
                        setData("p_seat", e);
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* <BorderlessTable
                title={
                  <div className="text-base font-bold">
                    {t("election.full_result", {
                      election: data.election,
                    })}
                    <span className="text-primary">{data.q_seat}</span>
                  </div>
                }
                data={data.data}
                isLoading={data.section2_loading}
              /> */}
              <div>
                <Carousel
                  _ref={sliderRef}
                  title={
                    <div className="text-base font-bold">
                      {t("election.full_result", {
                        election: data.election,
                      })}
                      <span className="text-primary">{data.q_seat}</span>
                    </div>
                  }
                  items={data.data.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={clx(
                        "mx-2 flex flex-col gap-2 rounded-xl border p-3 text-sm",
                        item.seat === data.q_seat
                          ? "border-dim"
                          : "border-outline dark:border-outlineHover-dark"
                      )}
                    >
                      <div className="flex flex-row justify-between">
                        <div className="justify-normal">
                          <span className="font-medium">{item.seat.slice(0, 5)}</span>
                          <span>{item.seat.slice(5)}</span>
                        </div>
                        <Tooltip tip={t("full_result")}>
                          {open => (
                            <FullResult
                              onClick={() => {
                                setData("open", true);
                                setData("index", index);
                              }}
                            />
                          )}
                        </Tooltip>
                      </div>
                      <div className="flex flex-row gap-1.5">
                        <ImageWithFallback
                          className="items-center self-center"
                          src={`/static/images/parties/${item.party}.png`}
                          width={28}
                          height={16}
                          alt={t(`${item.party}`)}
                        />
                        <span>{`${item.name} (${item.party})`}</span>
                        <Won />
                      </div>
                      <div className="flex flex-row items-center gap-1.5">
                        <p className="text-dim font-medium">{t("majority")}</p>
                        <BarMeter perc={item.majority.perc} width={30} />
                        <span>
                          {item.majority.abs === 0 ? `—` : numFormat(item.majority.abs, "standard")}
                        </span>
                        <span>
                          {item.majority.perc === null
                            ? `(—)`
                            : `(${Number(item.majority.perc).toFixed(1)}%)`}
                        </span>
                      </div>
                    </div>
                  ))}
                  itemsToScroll={
                    breakpoint <= BREAKPOINTS.MD ? 2 : breakpoint <= BREAKPOINTS.LG ? 3 : 4
                  }
                  itemsToShow={
                    breakpoint <= BREAKPOINTS.MD ? 2 : breakpoint <= BREAKPOINTS.LG ? 3 : 4
                  }
                />
              </div>

              {data.open && (
                <ElectionCard
                  open={data.open}
                  onChange={(index: number) =>
                    index < data.data.length && index >= 0 ? setData("index", index) : null
                  }
                  onClose={() => setData("open", false)}
                  onNext={() =>
                    data.index === data.data.length ? null : setData("index", data.index + 1)
                  }
                  onPrev={() => (data.index === 0 ? null : setData("index", data.index - 1))}
                  win={"won"}
                  election_name={data.data[data.index].election_name}
                  // date={DateTime.fromISO(data.result[data.index].date)
                  //   .setLocale(i18n.language)
                  //   .toLocaleString(DateTime.DATE_MED)}
                  title={
                    <div className="flex flex-col uppercase lg:flex-row lg:gap-2">
                      <h5>{data.data[data.index].seat.split(",")[0]}</h5>
                      <span className="text-dim font-normal">
                        {data.data[data.index].seat.split(",")[1]}
                      </span>
                      <span>{results[data.data[data.index].result]}</span>
                    </div>
                  }
                  isLoading={data.section2_Loading}
                  data={data.result}
                  highlightedRow={data.result.findIndex(
                    (r: Result) => r.name === data.data[data.index].name
                  )}
                  page={data.index}
                  total={data.data.length}
                />
              )}
            </div>
          </div>
          <div className="dark:border-t-outlineHover-dark border-t py-12 lg:grid lg:grid-cols-12">
            <div className="lg:col-span-10 lg:col-start-2">
              <h4 className="py-4 text-center">{t("election.section_3")}</h4>
              <div className="flex flex-row justify-between gap-4 sm:flex-row">
                <div className="flex flex-row items-baseline gap-2 lg:gap-4">
                  <Dropdown
                    anchor="left"
                    width="w-fit"
                    options={FILTER_OPTIONS}
                    selected={FILTER_OPTIONS.find(e => e.value === data.filter.value)}
                    onChange={e => setData("filter", e)}
                  />
                </div>
                <List
                  options={[t("election.map"), t("election.table")]}
                  icons={[
                    <MapIcon className="mr-1 h-5 w-5" />,
                    <TableCellsIcon className="mr-1 h-5 w-5" />,
                  ]}
                  current={data.tabs_section3}
                  onChange={index => setData("tabs_section3", index)}
                />
              </div>
              <Tabs
                hidden
                current={data.tabs_section3}
                onChange={index => setData("tabs_section3", index)}
              >
                <Panel name={t("election.map")} icon={<MapIcon className="mr-1 h-5 w-5" />}>
                  <div className="pt-6">
                    <LeftRightCard
                      left={
                        <div className="flex h-full w-full flex-col space-y-6 p-8">
                          <div className="flex flex-col gap-2">
                            <h4>
                              {t("election.choro_header", {
                                stat: t(`election.${data.filter.value}`),
                              })}
                            </h4>
                            <span className="text-dim text-sm">
                              {/* {t("common.data_of", { date: choropleth.data_as_of })} */}
                            </span>
                          </div>
                          <div className="flex grow flex-col justify-between space-y-6">
                            <div className="space-y-3 pt-6">
                              <p className="font-bold">{t("election.choro_rank")}</p>
                              {/* {topStateIndices.map((pos, i) => {
                          return (
                            <div className="flex space-x-3">
                              <div className="text-dim font-medium">#{i + 1}</div>
                              <div className="grow">{CountryAndStates[choropleth.data.x[pos]]}</div>
                              <div className="font-bold text-[#16A34A]">
                                {displayPercent(choropleth.data.y.perc[pos])}
                              </div>
                              <ArrowRightIcon className="text-dim h-4 w-4 self-center stroke-[1.5px]" />
                            </div>
                          );
                        })} */}
                            </div>
                          </div>
                        </div>
                      }
                      right={
                        <Choropleth
                          enableOutline={false}
                          type={data.tabs === 1 ? "dun" : "parlimen"}
                        />
                      }
                    />
                  </div>
                </Panel>
                <Panel
                  name={t("election.table")}
                  icon={<TableCellsIcon className="mr-1 h-5 w-5" />}
                >
                  <BorderlessTable isLoading={data.section3_loading} data={data.data} />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default ElectionExplorer;
