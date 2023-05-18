import Button from "@components/Button";
import Card from "@components/Card";
import Dropdown from "@components/Dropdown";
import {
  AtomIcon,
  BarChartIcon,
  CheckMarkIcon,
  LineChartIcon,
  PieChartIcon,
} from "@components/Icon";
import Input from "@components/Input";
import Spinner from "@components/Spinner";
import { OptionType } from "@components/types";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { clx } from "@lib/helpers";
import Image from "next/image";
import { FunctionComponent } from "react";

/**
 * Community Dashboard
 * @overview Status: In-development
 */

interface CommunityProps {}

const CommunityDashboard: FunctionComponent<CommunityProps> = () => {
  const { t } = useTranslation(["community", "common"]);
  const { data, setData } = useData({
    area_expertise: "",
    name: "",
    email: "",
    institution: "",
    experience: "",
    valid_area: false,
    valid_name: false,
    valid_email: false,
    valid_inst: false,
    valid_exp: false,
    loading: false,
    sent: false,
  });
  const FILTER_OPTIONS: Array<OptionType> = [
    "democracy",
    "demography",
    "agro_commodity",
    "economy",
    "tourism_culture",
    "digitalisation",
    "health",
    "education",
    "sports",
    "transport",
    "housing",
    "technology",
    "crime",
    "defence",
    "environment",
    "public_admin",
    "web_dev",
    "data_science",
  ].map((key: string) => ({
    label: t(key),
    value: key,
  }));

  const validate = async (): Promise<{
    area_expertise: string;
    name: string;
    email: string;
    institution: string;
    experience: string;
  }> =>
    new Promise((resolve, reject) => {
      if (!data.area_expertise) {
        setData("valid_area", t("area_required"));
        reject(t("area_required"));
      }
      if (!data.name) {
        setData("valid_name", t("name_required"));
        reject(t("name_required"));
      }
      if (!data.email) {
        setData("valid_email", t("email_required"));
        reject(t("email_required"));
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        setData("valid_email", t("email_invalid"));
        reject(t("email_invalid"));
      }
      if (!data.institution) {
        setData("valid_inst", t("inst_required"));
        reject(t("inst_required"));
      }
      if (!data.experience) {
        setData("valid_exp", t("exp_required"));
        reject(t("exp_required"));
      }
      resolve({
        area_expertise: data.area_expertise,
        name: data.name,
        email: data.email,
        institution: data.institution,
        experience: data.experience,
      });
    });

  return (
    <>
      <div className="bg-gradient-radial to-background md:px-4.5 min-h-screen max-w-screen-2xl from-[#E2E8F0] px-3 pb-16 pt-16 dark:from-[#3F3F46] dark:to-black lg:grid lg:grid-cols-12 lg:px-6">
        <div className="lg:col-span-10 lg:col-start-2">
          <div className="flex h-full w-full flex-col items-center gap-6 lg:flex-row">
            <div className="basis-3/5">
              <div className="flex flex-col space-y-6">
                <p className="text-primary dark:text-primary-dark font-semibold uppercase">{`${t(
                  "cta"
                )}!`}</p>
                <div className="space-y-3">
                  <h2>{t("header")}</h2>
                  <p className="text-dim whitespace-pre-line">{t("description")}</p>
                </div>
              </div>
            </div>
            <div className="z-10 w-full basis-2/5">
              <Card className="border-outline dark:border-washed-dark flex h-fit flex-col justify-between space-y-6 rounded-xl border bg-white dark:bg-black">
                {data.sent ? (
                  <div className="flex h-[300px] p-8">
                    <div className="flex flex-col self-center">
                      <CheckMarkIcon className="items-center self-center" />
                      <div className="mt-6 text-center text-lg font-bold text-black dark:text-white">
                        {t("thank_you")}
                      </div>
                      <div className="text-dim mt-3 whitespace-pre-line text-center text-sm">
                        {t("received")}
                      </div>
                    </div>
                  </div>
                ) : data.loading ? (
                  <div className="flex h-[300px] p-8">
                    <div className="mx-auto self-center">
                      <Spinner loading={data.loading} />
                    </div>
                  </div>
                ) : (
                  <form className="space-y-3 p-8">
                    <p>{t("fill_form")}</p>
                    <Dropdown
                      className="dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
                      anchor={"left"}
                      width={"w-full"}
                      options={FILTER_OPTIONS}
                      placeholder={t("area_expertise")}
                      selected={FILTER_OPTIONS.find(e => e.value === data.area_expertise)}
                      onChange={e => {
                        setData("valid_area", false);
                        setData("area_expertise", e.value);
                      }}
                    />
                    {data.valid_area && <p className="text-danger text-xs">{data.valid_area}</p>}
                    <Input
                      required
                      type="text"
                      placeholder={t("common:common.name")}
                      value={data.name}
                      onChange={e => {
                        setData("valid_name", false);
                        setData("name", e);
                      }}
                      spellCheck={false}
                      validation={data.valid_name}
                    />
                    <Input
                      required
                      type="email"
                      validation={data.valid_email}
                      placeholder={t("email")}
                      value={data.email}
                      onChange={e => {
                        setData("valid_email", false);
                        setData("email", e);
                      }}
                    />
                    <Input
                      required
                      type="text"
                      validation={data.valid_inst}
                      placeholder={t("institution")}
                      value={data.institution}
                      onChange={e => {
                        setData("valid_inst", false);
                        setData("institution", e);
                      }}
                    />
                    <div>
                      <textarea
                        required
                        className={clx(
                          "w-full resize-none rounded-md px-3 dark:bg-black",
                          "dark:focus:border-primary-dark focus:border-outlineHover outline-none focus:ring-0",
                          data.valid_exp
                            ? "border-danger border-2"
                            : "border-outline dark:border-washed-dark dark:hover:border-outlineHover-dark hover:border-outlineHover border"
                        )}
                        placeholder={t("experience")}
                        value={data.experience}
                        onChange={e => {
                          setData("valid_exp", false);
                          setData("experience", e.target.value);
                        }}
                        rows={5}
                      ></textarea>
                      {data.valid_exp && <p className="text-danger text-xs">{data.valid_exp}</p>}
                    </div>
                    <Button
                      className="btn btn-primary w-full justify-center"
                      onClick={() =>
                        validate().then(() => {
                          setData("loading", true);
                          setTimeout(() => {}, 1000);
                          setData("loading", false);
                          setData("sent", true);
                        })
                      }
                    >
                      {t("cta")}
                      <ChevronRightIcon className="h-5 w-5 text-white" />
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="atom1-float">
          <AtomIcon transform="rotate(-45)" />
        </div>
        <div className="bar1-float">
          <BarChartIcon transform="rotate(-6.1)" />
        </div>
        <div className="pie1-float">
          <PieChartIcon transform="rotate(-167.73) scale(1.1)" />
        </div>
        <div className="line1-float">
          <LineChartIcon transform="rotate(-10.44)" />
        </div>
        <div className="bar2-float">
          <BarChartIcon transform="rotate(16)" />
        </div>
        <div className="pie2-float">
          <PieChartIcon transform="scale(0.75)" />
        </div>
        <div className="pie3-float">
          <PieChartIcon transform="rotate(-138.9) scale(0.75)" />
        </div>
        <div className="atom2-float">
          <AtomIcon transform="rotate(-119.89)" />
        </div>
        <div className="line2-float">
          <LineChartIcon transform="rotate(17.13) scale(0.67)" />
        </div>
        <div className="bar3-float">
          <BarChartIcon transform="rotate(7.73)" />
        </div>
      </div>
    </>
  );
};

export default CommunityDashboard;
