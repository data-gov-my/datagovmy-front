import { CheckMarkIcon } from "../../icons";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { post } from "datagovmy-ui/api";
import {
  Accordion,
  Button,
  Card,
  Container,
  Dropdown,
  Input,
  Section,
  Spinner,
  toast,
} from "datagovmy-ui/components";
import { clx } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { FunctionComponent } from "react";

/**
 * Helpdesk
 * @overview Status: Live
 */

const HelpdeskDashboard: FunctionComponent = () => {
  const { t, i18n } = useTranslation(["helpdesk", "common"]);
  const { data, setData } = useData({
    name: "",
    email: "",
    institution: "",
    category: "",
    feedback: "",
    valid_name: false,
    valid_email: false,
    valid_inst: false,
    valid_category: false,
    valid_feedback: false,
    loading: false,
    sent: false,
  });

  const FILTER_OPTIONS: Array<OptionType> = ["general", "data-tech"].map((key: string) => ({
    label: t(key),
    value: key,
  }));

  const validate = async () =>
    new Promise((resolve, reject) => {
      if (
        data.name &&
        /\S+@\S+\.\S+/.test(data.email) &&
        data.institution &&
        data.category &&
        data.feedback
      ) {
        resolve({
          name: data.name,
          email: data.email,
          institution: data.institution,
          category: data.category.label,
          feedback: data.feedback,
        });
      } else {
        reject({
          name: !data.name && t("name_required"),
          email: !data.email
            ? t("email_required")
            : !/\S+@\S+\.\S+/.test(data.email) && t("email_invalid"),
          institution: !data.institution && t("inst_required"),
          category: !data.category && t("category_required"),
          feedback: !data.feedback && t("feedback_required"),
        });
      }
    });

  return (
    <>
      <Container
        background="bg-gradient-radial from-outline to-background dark:from-washed-dark dark:to-black"
        className="dark:border-outlineHover-dark border-b"
      >
        <div className="mx-auto flex h-[170px] flex-col space-y-3 py-12">
          <h2 className="text-center text-black">{t("header")}</h2>
          <p className="text-dim text-center">{t("description")}</p>
        </div>
      </Container>
      <Container className="min-h-screen">
        <Section title={<h4 className="mx-auto flex text-center">{t("faq")}</h4>}>
          <div className="flex w-full flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-10">
            <div className="flex w-full flex-col gap-3 lg:col-span-4 lg:col-start-2">
              <h5 className="mx-auto flex text-center font-bold">{t("general")}</h5>
              {[...Array(5)].map((_, i) => {
                i++;
                return (
                  <Accordion key={"general" + i} title={t("general_q" + i)}>
                    <p>{t("general_a" + i)}</p>
                  </Accordion>
                );
              })}
            </div>

            <div className="flex w-full flex-col gap-3 lg:col-span-4">
              <h5 className="mx-auto flex text-center font-bold">{t("data-tech")}</h5>
              {[...Array(5)].map((_, i) => {
                i++;
                return (
                  <Accordion key={"data-tech" + i} title={t("data-tech_q" + i)}>
                    <p>{t("data-tech_a" + i)}</p>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </Section>
        <Section title={<h4 className="mx-auto flex text-center">{t("form_title")}</h4>}>
          <div className="mx-auto w-full max-w-[450px]">
            <Card className="shadow-outline bg-white drop-shadow-xl dark:bg-black">
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
                  <p className="text-center font-bold">{t("ping")}</p>
                  <div className="space-y-3">
                    <Input
                      required
                      type="text"
                      placeholder={t("common:common.name")}
                      value={data.name}
                      onChange={e => {
                        setData("valid_name", false);
                        setData("name", e);
                      }}
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
                      placeholder={t("institution")}
                      value={data.institution}
                      onChange={e => {
                        setData("valid_inst", false);
                        setData("institution", e);
                      }}
                      validation={data.valid_inst}
                    />
                    <div className="space-y-2">
                      <Dropdown
                        className="dark:hover:border-outlineHover-dark dark:hover:bg-washed-dark/50"
                        anchor={"left"}
                        width={"w-full"}
                        options={FILTER_OPTIONS}
                        placeholder={t("category")}
                        selected={FILTER_OPTIONS.find(e => e.value === data.category.value)}
                        onChange={e => {
                          setData("valid_category", false);
                          setData("category", e);
                        }}
                      />
                      {data.valid_category && (
                        <p className="text-danger text-xs">{data.valid_category}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <textarea
                        required
                        className={clx(
                          "w-full resize-none rounded-md px-3 dark:bg-black",
                          "dark:focus:ring-primary-dark focus:ring-primary outline-none",
                          data.valid_feedback
                            ? "ring-danger"
                            : "border-outline dark:border-washed-dark dark:hover:border-outlineHover-dark"
                        )}
                        placeholder={t("tell_us")}
                        value={data.feedback}
                        onChange={e => {
                          setData("valid_feedback", false);
                          setData("feedback", e.target.value);
                        }}
                        rows={5}
                      ></textarea>
                      {data.valid_feedback && (
                        <p className="text-danger text-xs">{data.valid_feedback}</p>
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
                            "/forms/helpdesk",
                            {
                              name: resp.name,
                              email: resp.email,
                              institution: resp.institution,
                              category: resp.category,
                              feedback: resp.feedback,
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
                          setData("valid_name", err.name);
                          setData("valid_email", err.email);
                          setData("valid_inst", err.institution);
                          setData("valid_category", err.category);
                          setData("valid_feedback", err.feedback);
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
