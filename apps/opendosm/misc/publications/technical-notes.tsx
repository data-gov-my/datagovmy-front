import PublicationCard from "@components/Publication/Card";
import PublicationModal from "@components/Publication/Modal";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { routes } from "@lib/routes";
import { get, post } from "datagovmy-ui/api";
import { Button, Container, Input, Section, Spinner, toast } from "datagovmy-ui/components";
import { useData, useFilter, useTranslation } from "datagovmy-ui/hooks";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { Publication, Resource } from "./browse";

/**
 * Technical Notes
 * @overview Status: In-development
 */

interface TechnicalNotesProps {
  publications: Publication[];
  params: any;
  query: any;
  total_pubs: number;
}

const TechnicalNotesDashboard: FunctionComponent<TechnicalNotesProps> = ({
  publications,
  params,
  query,
  total_pubs,
}) => {
  const { t, i18n } = useTranslation(["publications", "common"]);
  const { push, events } = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 15;
  const { data, setData } = useData({
    loading: false,
    modal_loading: false,
    pub: "",
  });

  const { filter, setFilter, actives, queries } = useFilter({
    page: query.page ?? "",
    search: query.search ?? "",
  });

  const fetchResource = async (publication_id: string): Promise<Resource[]> => {
    return new Promise(resolve => {
      get(`/pub-docs-resource/${publication_id}`, {
        language: i18n.language,
      })
        .then(({ data }: { data: Resource[] }) => {
          resolve(data);
        })
        .catch(e => {
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
          console.error(e);
        });
    });
  };

  const postDownload = (resource_id: number) => {
    post(
      "/publication-resource/download/?documentation_type=true",
      {
        publication_id: params.pub_id,
        resource_id,
      },
      "api",
      { "Content-Type": "multipart/form-data" }
    )
      .then(({ data: res }) => {
        setData("pub", {
          ...data.pub,
          resources: data.pub.resources.map((pub: Resource) => {
            if (pub.resource_id === resource_id) {
              return {
                ...pub,
                downloads: res.download,
              };
            } else return pub;
          }),
        });
      })
      .catch(e => {
        console.error(e);
      });
  };

  useEffect(() => {
    if (params.pub_id) {
      fetchResource(params.pub_id).then(data => setData("pub", data));
      setShow(true);
    }
    events.on("routeChangeComplete", () => setData("loading", false));
    return () => {
      events.off("routeChangeComplete", () => setData("loading", false));
    };
  }, []);

  return (
    <Container className="min-h-screen">
      <Section>
        <h4 className="text-center">{t("technical_notes")}</h4>
        <div className="relative mx-auto mb-12 mt-6 w-full select-none overflow-hidden rounded-full border border-outline shadow-button hover:border-outlineHover focus:outline-none focus-visible:ring-0 dark:border-washed-dark dark:hover:border-outlineHover-dark sm:w-[500px]">
          <Input
            className="w-full truncate border-none bg-white py-3 pl-12 pr-10 text-base focus:outline-none focus:ring-0 dark:bg-black hover:dark:bg-washed-dark/50 focus:dark:bg-washed-dark"
            placeholder={t("select_publication")}
            value={filter.search}
            onChange={e => {
              setFilter("search", e);
              setData("loading", true);
            }}
          />
          <span className="absolute left-4 top-3.5">
            <MagnifyingGlassIcon className="h-5 w-5 text-black dark:text-dim" />
          </span>
        </div>

        {data.loading ? (
          <div className="flex h-[300px] w-full items-center justify-center">
            <Spinner loading={data.loading} />
          </div>
        ) : publications.length === 0 ? (
          <p className="flex h-[300px] w-full items-center justify-center text-dim">
            {t("common:common.no_entries")}.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {publications.map((item: Publication) => (
              <PublicationCard
                key={item.publication_id}
                publication={item}
                onClick={() => {
                  setData("modal_loading", true);
                  setShow(true);
                  push(
                    routes.PUBLICATIONS.concat(
                      "/technical-notes/",
                      item.publication_id,
                      actives.length ? queries : ""
                    ),
                    routes.PUBLICATIONS.concat("/technical-notes/", item.publication_id),
                    {
                      scroll: false,
                    }
                  );
                  fetchResource(item.publication_id).then(data => {
                    setData("pub", data);
                    setData("modal_loading", false);
                  });
                }}
              />
            ))}
          </div>
        )}

        <PublicationModal
          type={"/technical-notes/"}
          pub_id={params.pub_id}
          post={resource_id => postDownload(resource_id)}
          publication={data.pub}
          loading={data.modal_loading}
          show={show}
          hide={() => {
            setShow(false);
            push(
              routes.PUBLICATIONS.concat("/technical-notes/", actives.length ? queries : ""),
              undefined,
              {
                scroll: false,
              }
            );
          }}
        />

        {total_pubs > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center gap-4 pt-8 text-sm font-medium">
            <Button
              variant="default"
              onClick={() => setFilter("page", `${+filter.page - 1}`)}
              disabled={filter.page === "1"}
            >
              <ChevronLeftIcon className="h-4.5 w-4.5" />
              {t("common:common.previous")}
            </Button>

            <span className="flex items-center gap-1 text-center">
              {t("common:common.page_of", {
                current: filter.page,
                total: Math.ceil(total_pubs / ITEMS_PER_PAGE),
              })}
            </span>
            <Button
              variant="default"
              onClick={() => {
                setFilter("page", `${+filter.page + 1}`);
              }}
              disabled={filter.page === `${Math.ceil(total_pubs / ITEMS_PER_PAGE)}`}
            >
              {t("common:common.next")}
              <ChevronRightIcon className="h-4.5 w-4.5" />
            </Button>
          </div>
        )}
      </Section>
    </Container>
  );
};

export default TechnicalNotesDashboard;
