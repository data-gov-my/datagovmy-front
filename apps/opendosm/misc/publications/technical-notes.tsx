import {
  PublicationModal,
  PublicationCard,
  PubResource,
  Resource,
  Publication,
} from "datagovmy-ui/components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { routes } from "@lib/routes";
import { get, post } from "datagovmy-ui/api";
import { Button, Container, Input, Section, Spinner, toast } from "datagovmy-ui/components";
import { useData, useFilter, useTranslation } from "datagovmy-ui/hooks";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";

/**
 * Technical Notes
 * @overview Status: In-development
 */

interface TechnicalNotesProps {
  pub: PubResource;
  publications: Publication[];
  params: any;
  query: any;
  total_pubs: number;
}

const TechnicalNotesDashboard: FunctionComponent<TechnicalNotesProps> = ({
  pub,
  publications,
  params,
  query,
  total_pubs,
}) => {
  const { t } = useTranslation(["publications", "common"]);
  const { push, events } = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 15;
  const { data, setData } = useData({
    loading: false,
    modal_loading: false,
    pub: pub,
  });

  const { filter, setFilter, actives, queries } = useFilter({
    page: query.page ?? "",
    search: query.search ?? "",
  });

  const postDownload = async (resource_id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/events?name=dgmy_pub_dls`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_TOKEN}`,
          },
          body: JSON.stringify({
            publication_id: params.pub_id,
            resource_id: resource_id,
          }),
        }
      );

      setData("pub", {
        ...data.pub,
        resources: data.pub.resources.map((pub: Resource) => {
          if (pub.resource_id === resource_id) {
            return {
              ...pub,
              downloads: pub.downloads + 1,
            };
          } else return pub;
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (pub) {
      setShow(true);
      setData("pub", pub);
    }
    events.on("routeChangeComplete", () => {
      setData("loading", false);
      setData("modal_loading", false);
    });
    return () => {
      events.off("routeChangeComplete", () => {
        setData("loading", false);
        setData("modal_loading", false);
      });
    };
  }, [pub]);

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
