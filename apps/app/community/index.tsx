import Button from "@components/Button";
import Card from "@components/Card";
import Dropdown from "@components/Dropdown";
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
    phone: "",
    institution: "",
    experience: "",
    valid_area: false,
    valid_name: false,
    valid_email: false,
    valid_phone: false,
    valid_inst: false,
    valid_exp: false,
    loading: false,
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

  const validate = async (): Promise<{ email: string; phone: string }> =>
    new Promise((resolve, reject) => {
      if (data.email && data.phone) {
        resolve({ email: data.email, phone: data.phone });
      }
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
      if (!data.phone) {
        setData("valid_phone", t("phone_required"));
        reject(t("phone_required"));
      }
      if (!data.institution) {
        setData("valid_inst", t("inst_required"));
        reject(t("inst_required"));
      }
      if (!data.experience) {
        setData("valid_exp", t("exp_required"));
        reject(t("exp_required"));
      }
    });

  //
  return (
    <>
      <div className="bg-gradient-radial to-background md:px-4.5 max-w-screen-2xl from-[#E2E8F0] px-3 pb-16 pt-16 dark:from-[#3F3F46] dark:to-black lg:grid lg:grid-cols-12 lg:px-6">
        <div className="lg:col-span-10 lg:col-start-2">
          <div className="flex flex-col items-center gap-6 lg:flex-row">
            <div className="">
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
            <div className="z-10 w-full min-w-max">
              <Card className="border-outline dark:border-washed-dark flex flex-col justify-between space-y-6 rounded-xl border bg-white p-8 dark:bg-black">
                <div>{t("fill_form")}</div>
                <form className="space-y-3">
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
                  <div className="space-y-1">
                    <input
                      required
                      type="text"
                      className={clx(
                        "w-full rounded-md bg-white dark:bg-black",
                        "dark:focus:border-primary-dark focus:border-outlineHover outline-none focus:ring-0",
                        data.valid_name
                          ? "border-danger border-2"
                          : "border-outline hover:border-outlineHover dark:border-washed-dark dark:hover:border-outlineHover-dark border"
                      )}
                      placeholder={t("common:common.name")}
                      value={data.name}
                      onChange={e => {
                        setData("valid_name", false);
                        setData("name", e.target.value);
                      }}
                      spellCheck={false}
                    />
                    {data.valid_name && <p className="text-danger text-xs">{data.valid_name}</p>}
                  </div>
                  <div className="space-y-1">
                    <input
                      required
                      type="email"
                      className={clx(
                        "w-full rounded-md bg-white dark:bg-black",
                        "dark:focus:border-primary-dark focus:border-outlineHover outline-none focus:ring-0",
                        data.valid_email
                          ? "border-danger border-2"
                          : "border-outline hover:border-outlineHover dark:border-washed-dark dark:hover:border-outlineHover-dark border"
                      )}
                      placeholder={t("email")}
                      value={data.email}
                      onChange={e => {
                        setData("valid_email", false);
                        setData("email", e.target.value);
                      }}
                    />
                    {data.valid_email && <p className="text-danger text-xs">{data.valid_email}</p>}
                  </div>
                  <div className="space-y-1">
                    <input
                      required
                      type="tel"
                      className={clx(
                        "w-full rounded-md bg-white dark:bg-black",
                        "dark:focus:border-primary-dark focus:border-outlineHover outline-none focus:ring-0",
                        data.valid_phone
                          ? "border-danger border-2"
                          : "border-outline hover:border-outlineHover dark:border-washed-dark dark:hover:border-outlineHover-dark border"
                      )}
                      placeholder={t("phone")}
                      value={data.phone}
                      onChange={e => {
                        setData("valid_phone", false);
                        setData("phone", e.target.value);
                      }}
                    />
                    {data.valid_phone && <p className="text-danger text-xs">{data.valid_phone}</p>}
                  </div>
                  <div className="space-y-1">
                    <input
                      required
                      type="text"
                      className={clx(
                        "w-full rounded-md bg-white dark:bg-black",
                        "dark:focus:border-primary-dark focus:border-outlineHover outline-none focus:ring-0",
                        data.valid_inst
                          ? "border-danger border-2"
                          : "border-outline hover:border-outlineHover dark:border-washed-dark dark:hover:border-outlineHover-dark border"
                      )}
                      placeholder={t("institution")}
                      value={data.institution}
                      onChange={e => {
                        setData("valid_inst", false);
                        setData("institution", e.target.value);
                      }}
                    />
                    {data.valid_inst && <p className="text-danger text-xs">{data.valid_inst}</p>}
                  </div>
                  <div>
                    <textarea
                      required
                      className={clx(
                        "w-full resize-none rounded-md px-3  dark:bg-black",
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
                      rows={3}
                    ></textarea>
                    {data.valid_exp && <p className="text-danger text-xs">{data.valid_exp}</p>}
                  </div>
                </form>
                <Button
                  className="btn btn-primary w-full justify-center"
                  onClick={() => validate().then(() => null)}
                >
                  {t("cta")}
                  <ChevronRightIcon className="h-5 w-5 text-white" />
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="atom1-float">
        <Image
          src={`/static/images/community/atom.svg`}
          width={62}
          height={60}
          alt={"atom1"}
          className="atom1-rotate"
        />
      </div>
      <div className="bar1-float">
        <Image
          src={`/static/images/community/bar.svg`}
          width={60}
          height={43}
          alt={"bar1"}
          className="bar1-rotate"
        />
      </div>
      <div className="pie1-float">
        <Image
          src={`/static/images/community/pie.svg`}
          width={77}
          height={70}
          alt={"pie1"}
          className="pie1-rotate"
        />
      </div>
      <div className="line1-float">
        <Image
          src={`/static/images/community/line.svg`}
          width={58}
          height={52}
          alt={"line1"}
          className="line1-rotate"
        />
      </div>
      <div className="bar2-float">
        <Image
          src={`/static/images/community/bar.svg`}
          width={43}
          height={32}
          alt={"bar2"}
          className="bar2-rotate"
        />
      </div>
      <div>
        <Image
          src={`/static/images/community/pie.svg`}
          width={45}
          height={40}
          alt={"pie2"}
          className="pie2"
        />
      </div>
      <div className="pie3-float">
        <Image
          src={`/static/images/community/pie.svg`}
          width={46}
          height={42}
          alt={"pie3"}
          className="pie3-rotate"
        />
      </div>
      <div className="atom2-float">
        <Image
          src={`/static/images/community/atom.svg`}
          width={63}
          height={61}
          alt={"atom2"}
          className="atom2-rotate"
        />
      </div>
      <div className="line2-float">
        <Image
          src={`/static/images/community/line.svg`}
          width={53}
          height={48}
          alt={"line2"}
          className="line2-rotate"
        />
      </div>
      <div className="bar3-float">
        <Image
          src={`/static/images/community/bar.svg`}
          width={56}
          height={41}
          alt={"bar3"}
          className="bar3-rotate"
        />
      </div>
    </>
  );
};

export default CommunityDashboard;
