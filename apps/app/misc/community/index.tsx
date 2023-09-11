import { AtomIcon, BarChartIcon, CheckMarkIcon, LineChartIcon, PieChartIcon } from "../../icons";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { post } from "datagovmy-ui/api";
import { Button, Card, Container, Dropdown, Input, Spinner, toast } from "datagovmy-ui/components";
import { clx } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent } from "react";

/**
 * Community Signups.
 * @overview Status: Live
 */

const CommunityDashboard: FunctionComponent = () => {
  const { t, i18n } = useTranslation(["community", "common"]);
  const { data, setData } = useData({
    expertise_area: "",
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

  const validate = async () =>
    new Promise((resolve, reject) => {
      if (
        data.expertise_area &&
        data.name &&
        /\S+@\S+\.\S+/.test(data.email) &&
        data.institution &&
        data.experience
      ) {
        resolve({
          expertise_area: data.expertise_area.label,
          name: data.name,
          email: data.email,
          institution: data.institution,
          experience: data.experience,
        });
      } else {
        reject({
          expertise_area: !data.expertise_area && t("area_required"),
          name: !data.name && t("name_required"),
          email: !data.email
            ? t("email_required")
            : !/\S+@\S+\.\S+/.test(data.email) && t("email_invalid"),
          institution: !data.institution && t("inst_required"),
          experience: !data.experience && t("exp_required"),
        });
      }
    });

  return (
    <>
      <Container
        className="relative flex flex-grow flex-col overflow-hidden"
        background="flex flex-col flex-grow items-center bg-gradient-radial to-background from-[#E2E8F0] dark:from-[#3F3F46] dark:to-black"
      >
        <div className="flex min-h-[680px] flex-grow flex-col pb-16 pt-16 lg:grid lg:grid-cols-12">
          <div className="flex flex-col justify-center lg:col-span-10 lg:col-start-2">
            <div className="z-20 flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
              <div className="flex-1">
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
              <div className="w-full lg:w-[450px]">
                <Card className="bg-white dark:bg-black">
                  {data.sent ? (
                    <div className="flex h-[300px] flex-col items-center justify-center space-y-6 p-6 lg:p-8">
                      <CheckMarkIcon />
                      <div className="space-y-3">
                        <p className="text-center text-lg font-bold">{t("thank_you")}</p>
                        <p className="text-dim whitespace-pre-line text-center text-sm">
                          {t("received")}
                        </p>
                      </div>
                    </div>
                  ) : data.loading ? (
                    <div className="flex h-[300px] items-center justify-center">
                      <Spinner loading={data.loading} />
                    </div>
                  ) : (
                    <form className="space-y-6 p-6 lg:p-8" method="post">
                      <p>{t("fill_form")}</p>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Dropdown
                            className="dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
                            anchor={"left"}
                            width={"w-full"}
                            options={FILTER_OPTIONS}
                            placeholder={t("area_expertise")}
                            selected={FILTER_OPTIONS.find(
                              e => e.value === data.expertise_area.value
                            )}
                            onChange={e => {
                              setData("valid_area", false);
                              setData("expertise_area", e);
                            }}
                          />
                          {data.valid_area && (
                            <p className="text-danger text-xs">{data.valid_area}</p>
                          )}
                        </div>
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
                          placeholder={t("email")}
                          value={data.email}
                          onChange={e => {
                            setData("valid_email", false);
                            setData("email", e);
                          }}
                          validation={data.valid_email}
                        />
                        <Input
                          required
                          type="text"
                          placeholder={t("institution")}
                          value={data.institution}
                          onChange={e => {
                            setData("valid_inst", false);
                            setData("institution", e);
                          }}
                          validation={data.valid_inst}
                        />
                        <div className="space-y-2">
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
                            rows={6}
                            spellCheck={false}
                          ></textarea>
                          {data.valid_exp && (
                            <p className="text-danger text-xs">{data.valid_exp}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        className="btn-primary w-full justify-center"
                        onClick={() =>
                          validate()
                            .then((resp: any) => {
                              setData("loading", true);
                              post(
                                "/forms/mods",
                                {
                                  expertise_area: resp.expertise_area,
                                  name: resp.name,
                                  email: resp.email,
                                  institution: resp.institution,
                                  description: resp.experience,
                                  language: i18n.language,
                                },
                                "api",
                                { "Content-Type": "multipart/form-data" }
                              )
                                .then(({ data }) => {
                                  if (data["Email Status"] === "sent") {
                                    setData("sent", true);
                                  }
                                })
                                .catch(e => {
                                  toast.error(
                                    t("common:error.toast.form_submission_failure"),
                                    t("common:error.toast.reach_support")
                                  );
                                  console.error(e);
                                });
                              setData("loading", false);
                            })
                            .catch(err => {
                              setData("valid_area", err.expertise_area);
                              setData("valid_name", err.name);
                              setData("valid_email", err.email);
                              setData("valid_inst", err.institution);
                              setData("valid_exp", err.experience);
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
          <div className="line1-float">
            <LineChartIcon transform="rotate(-10.44)" />
          </div>
          <div className="bar2-float">
            <BarChartIcon transform="rotate(16)" />
          </div>
          <div className="pie1-float">
            <PieChartIcon transform="scale(0.75)" />
          </div>
          <div className="pie2-float">
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
          <div className="pie3-float">
            <PieChartIcon transform="rotate(-167.73)" />
          </div>
        </div>
      </Container>
    </>
  );
};

export default CommunityDashboard;
