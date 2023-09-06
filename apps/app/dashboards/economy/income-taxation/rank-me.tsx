import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { get } from "datagovmy-ui/api";
import {
  Card,
  Container,
  Dropdown,
  Input,
  Label,
  Radio,
  Section,
  Spinner,
  StateDropdown,
  toast,
} from "datagovmy-ui/components";
import { BREAKPOINTS, CountryAndStates } from "datagovmy-ui/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent, useContext, useRef } from "react";

/**
 * Income Taxation - Rank
 * @overview Status: In-development
 */

interface IncomeRankProps {}

const IncomeRank: FunctionComponent<IncomeRankProps> = ({}) => {
  const { t } = useTranslation(["dashboard-income-taxation", "common"]);
  const barRef = useRef<HTMLParagraphElement>(null);
  const { size } = useContext(WindowContext);

  const INCOME_OR_TAX: Array<OptionType> = [
    { label: t("annual_income"), value: "income" },
    { label: t("annual_tax_paid"), value: "tax_paid" },
  ];
  const AGE_OPTIONS: OptionType[] = [
    "all_ages",
    "18-24",
    "25-29",
    "30-34",
    "35-39",
    "40-44",
    "45-49",
    "50-54",
    "55-59",
    "60-46",
    "65-69",
    "70-74",
    "75-79",
    "80-84",
    "85+",
  ].map((key: string) => ({ label: t(key), value: key }));
  const ASSESSMENT_OPTIONS: OptionType[] = ["self", "joint"].map((key: string) => ({
    label: t(key),
    value: key,
  }));

  const { data, setData } = useData({
    income_or_tax: INCOME_OR_TAX[0],
    amount: "",
    valid_amount: false,
    state: "mys",
    assessment: ASSESSMENT_OPTIONS[0].value,
    age: AGE_OPTIONS[0].value,
    loading: false,
    result: true,
    percent: null,
  });

  const { data: result, setData: setResult } = useData({
    income_or_tax: INCOME_OR_TAX[0].value,
    state: "",
    age: AGE_OPTIONS[0].value,
    percent: null,
  });

  const fetchData = () => {
    setData("loading", true);
    // get("/dashboard", {
    //   dashboard: "rank",
    //   income_or_tax: data.income_or_tax,
    //   amount: data.amount,
    //   state: data.state,
    //   age: data.age,
    // })
    //   .then(({ data }) => {
    //     setData("result", data);
    //   })
    //   .catch(e => {
    //     toast.error(
    //       t("common:error.toast.form_submission_failure"),
    //       t("common:error.toast.reach_support")
    //     );
    //     console.error(e);
    //   });
    setResult("percent", Math.round(Math.random() * 100));
    setTimeout(() => setData("loading", false), 500);
  };

  const handleSearch = () => {
    if (data.amount && data.amount >= 0) {
      setData("percent", result.percent);
      fetchData();
      if (size.width <= BREAKPOINTS.SM)
        barRef && barRef.current && barRef.current.scrollIntoView({ behavior: "smooth" });
    } else setData("valid_amount", t("valid_amount"));
  };

  return (
    <Section className="py-8 lg:py-12 xl:px-20">
      <h5 className="pb-8 text-center">{t("rank_header")}</h5>
      <div className="flex flex-col gap-6 rounded-xl sm:flex-row lg:gap-8">
        <Card className="bg-background dark:bg-background-dark shadow-button h-max w-full space-y-6 p-6 sm:w-5/12 lg:w-1/3">
          <div className="space-y-3">
            <Radio
              name="income_or_tax"
              className="flex flex-row flex-wrap gap-3"
              options={INCOME_OR_TAX}
              value={data.income_or_tax}
              onChange={e => {
                setData("income_or_tax", e);
              }}
            />
            <Input
              required
              autoFocus
              type="number"
              placeholder={t("enter_amount", { context: data.income_or_tax.value })}
              value={data.amount}
              validation={data.valid_amount}
              onChange={e => {
                setData("amount", e);
                setData("valid_amount", false);
              }}
              onKeyDown={e => {
                if (e.key === "Enter") handleSearch();
              }}
              min={"0"}
            />
          </div>

          <div className="space-y-3">
            <Label label={t("filter_by")} className="text-dim text-sm" />
            <div className="flex flex-col gap-y-2">
              <StateDropdown
                currentState={data.state}
                onChange={selected => setData("state", selected.value)}
                anchor="left"
                width="w-full"
              />

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 sm:max-[876px]:col-span-3">
                  <Dropdown
                    placeholder={t("assessment")}
                    options={ASSESSMENT_OPTIONS}
                    anchor="left"
                    width="w-full"
                    selected={ASSESSMENT_OPTIONS.find(e => e.value === data.assessment)}
                    onChange={e => setData("assessment", e.value)}
                  />
                </div>
                <div className="col-span-1 sm:max-[876px]:col-span-3">
                  <Dropdown
                    placeholder={t("age")}
                    options={AGE_OPTIONS}
                    anchor="right"
                    width="w-full"
                    selected={AGE_OPTIONS.find(e => e.value === data.age)}
                    onChange={e => setData("age", e.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <button className="btn-primary my-6" onClick={handleSearch}>
            {t("rank_me")}
          </button>
          <p ref={barRef} className="text-dim text-sm">
            {/* FIXME: year */}
            {t("disclaimer", { year: 2022 })}
          </p>
        </Card>
        <div className="w-full sm:w-7/12 lg:w-2/3">
          {!result.percent ? (
            <Card className="border-outline dark:border-washed-dark hidden h-full items-center gap-6 rounded-xl border p-8 sm:flex">
              <Card className="border-outline bg-outline dark:border-washed-dark dark:bg-washed-dark mx-auto flex h-min w-fit flex-row gap-2 self-center rounded-md border px-3 py-1.5">
                <MagnifyingGlassIcon className="mx-auto mt-1 h-4 w-4 text-black dark:text-white" />
                <p>{t("start_search")}</p>
              </Card>
            </Card>
          ) : data.loading ? (
            <div className="shadow-button border-outline dark:border-washed-dark flex h-full w-full items-center justify-center rounded-xl border">
              <Spinner loading={data.loading} />
            </div>
          ) : (
            <div className="border-outline dark:border-washed-dark dark:divide-washed-dark shadow-button flex flex-col rounded-xl border max-lg:divide-y lg:flex-row lg:divide-x">
              <div className="bg-background dark:bg-background-dark/50 flex h-auto w-full flex-col items-center gap-6 p-6 max-lg:rounded-t-xl lg:h-[400px] lg:w-1/2 lg:rounded-l-xl lg:p-8">
                <p className="text-dim font-medium">{t("earned_more")}</p>
                <div className="bg-outline dark:bg-washed-dark relative flex h-[200px] w-3 rounded-md lg:h-[250px]">
                  {data.loading ? (
                    <></>
                  ) : (
                    <div
                      className="from-primary absolute bottom-0 w-full animate-[grow_1.5s_ease-in-out] rounded-md bg-gradient-to-t to-[#5B8EFF]"
                      style={{
                        ["--from-height" as string]: `${100 - (data.percent ?? 100)}%`,
                        ["--to-height" as string]: `${((100 - result.percent) / 100) * 95 + 5}%`,
                        height: `${((100 - result.percent) / 100) * 93 + 5}%`,
                      }}
                    >
                      <div className="border-r-primary dark:border-r-primary-dark ml-[22px] h-0 w-0 -translate-y-1 border-b-[7px] border-r-[7px] border-t-[7px] border-b-transparent border-t-transparent lg:-translate-y-2"></div>
                      <p className="ml-10 w-max -translate-y-[23px] font-bold lg:-translate-y-[27px]">
                        {t("you_are_here")}
                      </p>
                    </div>
                  )}
                  <div className="text-dim flex -translate-x-14 flex-col gap-[25px] whitespace-nowrap text-right text-sm lg:gap-[37px]">
                    <p>1% —</p>
                    <p>25% —</p>
                    <p>50% —</p>
                    <p>75% —</p>
                    <p>99% —</p>
                  </div>
                </div>
                <p className="text-dim font-medium">{t("earned_less")}</p>
              </div>
              <div className="flex w-full flex-col justify-center gap-3 bg-white p-6 dark:bg-black max-lg:rounded-b-xl lg:h-[400px] lg:w-1/2 lg:rounded-r-xl lg:p-8">
                <p>
                  <span className="text-lg font-bold">{t("top")}</span>
                  <span className="text-primary dark:text-primary-dark text-lg font-bold">
                    {result.percent}%
                  </span>
                  <span className="text-lg font-bold">{t("of_taxpayers")}</span>
                </p>
                <p className="text-dim">
                  {t("rank_desc", {
                    more: t(`_${data.income_or_tax.value}`),
                    group_size_below: 1000,
                    group_size: 1000,
                    aged: data.age === "all_ages" ? "" : `${t("aged")} ${t(data.age)}`,
                    state: CountryAndStates[data.state],
                    year: 2022, // FIXME: year
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default IncomeRank;
