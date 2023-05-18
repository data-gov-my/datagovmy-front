import Accordion from "@components/Accordion";
import Button from "@components/Button";
import Card from "@components/Card";
import Container from "@components/Container";
import Dropdown from "@components/Dropdown";
import Input from "@components/Input";
import Section from "@components/Section";
import Spinner from "@components/Spinner";
import { OptionType } from "@components/types";
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { clx } from "@lib/helpers";
import { FunctionComponent } from "react";

/**
 * Helpdesk Dashboard
 * @overview Status: In-development
 */

interface HelpdeskProps {}

const HelpdeskDashboard: FunctionComponent<HelpdeskProps> = () => {
  const { t } = useTranslation(["community", "common"]);
  const { data, setData } = useData({
    name: "",
    email: "",
    category: "",
    institution: "",
    experience: "",
    valid_name: false,
    valid_email: false,
    valid_category: false,
    valid_inst: false,
    valid_exp: false,
    loading: false,
    sent: false,
  });

  const FILTER_OPTIONS: Array<OptionType> = ["general", "data-tech"].map((key: string) => ({
    label: t(key),
    value: key,
  }));

  const validate = async (): Promise<{
    name: string;
    email: string;
    category: string;
    institution: string;
    experience: string;
  }> =>
    new Promise((resolve, reject) => {
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
      if (!data.category) {
        setData("valid_category", t("category_required"));
        reject(t("category_required"));
      }
      if (!data.experience) {
        setData("valid_exp", t("exp_required"));
        reject(t("exp_required"));
      }
      resolve({
        name: data.name,
        email: data.email,
        institution: data.institution,
        category: data.category,
        experience: data.experience,
      });
    });

  return (
    <>
      <Container background="bg-gradient-radial from-[#E2E8F0] to-background dark:from-[#3F3F46] dark:to-black">
        <div className="mx-auto flex h-[170px] flex-col space-y-3 py-12">
          <h2 className="text-center text-black">{t("header")}</h2>

          <p className="text-dim text-center">{t("description")}</p>
        </div>
      </Container>
      <Container className="min-h-screen">
        <Section title={<h4 className="mx-auto flex text-center">{t("faq")}</h4>}>
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-10">
            <div className="flex w-full flex-col gap-3 lg:col-span-4 lg:col-start-2">
              <h5 className="mx-auto flex text-center font-bold">{t("general")}</h5>
              <Accordion
                icon={<PlusIcon className="absolute h-5 w-5 items-center self-center" />}
                title={t("general_q1")}
                children={t("general_a1")}
              />
              <Accordion
                icon={<PlusIcon className="absolute h-5 w-5 items-center self-center" />}
                title={t("general_q2")}
                children={t("general_a2")}
              />
              <Accordion
                icon={<PlusIcon className="absolute h-5 w-5 items-center self-center" />}
                title={t("general_q3")}
                children={t("general_a3")}
              />
              <Accordion
                icon={<PlusIcon className="absolute h-5 w-5 items-center self-center" />}
                title={t("general_q4")}
                children={t("general_a4")}
              />
              <Accordion
                icon={<PlusIcon className="absolute h-5 w-5 items-center self-center" />}
                title={t("general_q5")}
                children={t("general_a5")}
              />
            </div>

            <div className="flex w-full flex-col gap-3 lg:col-span-4">
              <h5 className="mx-auto flex text-center font-bold">{t("data-tech")}</h5>
              <Accordion
                icon={<PlusIcon className="absolute h-5 w-5 items-center self-center" />}
                title={t("data-tech_q1")}
                children={t("data-tech_a1")}
              />
              <Accordion
                icon={<PlusIcon className="absolute h-5 w-5 items-center self-center" />}
                title={t("data-tech_q2")}
                children={t("data-tech_a2")}
              />
              <Accordion
                icon={<PlusIcon className="absolute h-5 w-5 items-center self-center" />}
                title={t("data-tech_q3")}
                children={t("data-tech_a3")}
              />
              <Accordion
                icon={<PlusIcon className="absolute h-5 w-5 items-center self-center" />}
                title={t("data-tech_q4")}
                children={t("data-tech_a4")}
              />
              <Accordion
                icon={<PlusIcon className="absolute h-5 w-5 items-center self-center" />}
                title={t("data-tech_q5")}
                children={t("data-tech_a5")}
              />
            </div>
          </div>
        </Section>
        <Section title={<h4 className="mx-auto flex text-center">{t("form_title")}</h4>}>
          <div className="grid w-auto grid-cols-1 lg:grid-cols-3">
            <Card className="border-outline dark:border-washed-dark flex h-fit flex-col justify-between space-y-6 rounded-xl border bg-white dark:bg-black lg:col-start-2">
              {data.sent ? (
                <div className="flex h-[300px] p-8">
                  <div className="flex flex-col self-center">
                    {/* <CheckMarkIcon className="items-center self-center" /> */}
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
                  <p className="text-center font-bold">{t("ping")}</p>
                  <Input
                    required
                    type="text"
                    placeholder={t("common:common.name")}
                    value={data.name}
                    onChange={e => {
                      setData("valid_name", false);
                      setData("name", e);
                    }}
                    //   spellCheck={false}
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
                  <Dropdown
                    className="dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
                    anchor={"left"}
                    width={"w-full"}
                    options={FILTER_OPTIONS}
                    placeholder={t("category")}
                    selected={FILTER_OPTIONS.find(e => e.value === data.area_expertise)}
                    onChange={e => {
                      setData("valid_category", false);
                      setData("category", e.value);
                    }}
                  />
                  {data.valid_category && (
                    <p className="text-danger text-xs">{data.valid_category}</p>
                  )}
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
                      placeholder={t("tell_us")}
                      value={data.feedback}
                      onChange={e => {
                        setData("valid_exp", false);
                        setData("feedback", e.target.value);
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
                    {t("submit")}
                    <ChevronRightIcon className="h-5 w-5 text-white" />
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default HelpdeskDashboard;
