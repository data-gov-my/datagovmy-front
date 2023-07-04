import { Button } from "..";
import BarPerc from "@components/Chart/BarMeter/BarPerc";
import ElectionTable from "@components/Chart/Table/ElectionTable";
import Font from "@config/font";
import type {
  BaseResult,
  Candidate,
  Party,
  PartyResult,
  Seat,
} from "@dashboards/democracy/election-explorer/types";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { clx, numFormat, slugify, toDate } from "@lib/helpers";
import { Fragment, ReactElement, useState } from "react";

export type Result<T> = {
  data: T;
  votes?: Array<{
    x: string;
    abs: number;
    perc: number;
  }>;
} | void;

interface ElectionCardProps<T extends Candidate | Party | Seat> {
  defaultParams: T;
  onChange: (option: T) => Promise<Result<BaseResult[] | PartyResult>>;
  options: Array<T>;
  columns?: any;
  title?: string | ReactElement;
  subtitle?: boolean;
  highlighted?: string;
  page: number;
}

const ElectionCard = <T extends Candidate | Party | Seat>({
  defaultParams,
  onChange,
  options,
  columns,
  title,
  subtitle = false,
  highlighted,
  page,
}: ElectionCardProps<T>) => {
  const [show, setShow] = useState<boolean>(false);
  const { data, setData } = useData({
    index: page,
    result: [],
    loading: false,
  });
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);

  if (options.length <= 0) return <></>;

  return (
    <>
      <Button
        className="btn text-dim hover:text-black dark:hover:text-white"
        onClick={() => {
          setData("loading", true);
          setShow(true);
          onChange(defaultParams).then(item => {
            if (!item) return;
            setData("result", item);
            setData("loading", false);
          });
        }}
      >
        <ArrowsPointingOutIcon className="h-4.5 w-4.5" />
        <p className="whitespace-nowrap font-normal">{t("full_result")}</p>
      </Button>

      <Transition show={show} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={() => setShow(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={clx(
                    Font.body.variable,
                    "border-outline dark:border-outlineHover-dark shadow-floating w-full max-w-4xl transform rounded-xl border bg-white p-6 text-left align-middle font-sans transition-all dark:bg-black"
                  )}
                >
                  <Dialog.Title
                    as="div"
                    className="flex w-full flex-row items-center justify-between text-lg"
                  >
                    {title && typeof title === "string" ? <h5>{title}</h5> : title}
                    <button
                      className="hover:bg-washed dark:hover:bg-washed-dark group absolute right-6 top-6 h-8 w-8 rounded-full"
                      onClick={() => setShow(false)}
                    >
                      <XMarkIcon className="text-dim mx-auto h-6 w-6" />
                    </button>
                  </Dialog.Title>

                  <div className="space-y-6 text-base">
                    <div className="space-x-3 pt-2">
                      {subtitle && (
                        <>
                          <span className="uppercase">
                            {t(options[data.index]?.election_name.slice(-5))}
                          </span>
                          <span className="text-dim">
                            {toDate(options[data.index]?.date, "dd MMM yyyy", i18n.language)}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="font-bold">{t("election_result")}</div>
                      <ElectionTable
                        className="max-h-96 w-full overflow-y-auto"
                        data={data.result.data}
                        columns={columns}
                        isLoading={data.loading}
                        highlightedRows={
                          data.result.data && highlighted
                            ? "name" in data.result.data[0]
                              ? [
                                  data.result.data.findIndex(
                                    (e: BaseResult) => slugify(e.name) === highlighted
                                  ),
                                ]
                              : "party" in data.result.data[0]
                              ? [
                                  data.result.data.findIndex(
                                    (e: BaseResult) => e.party === highlighted
                                  ),
                                ]
                              : [-1]
                            : [0]
                        }
                        result={"result" in defaultParams ? defaultParams.result : undefined}
                      />
                    </div>

                    {data.result.votes && (
                      <div className="space-y-3">
                        <div className="font-bold">{t("voting_statistics")}</div>
                        <div className="flex flex-col gap-3 text-sm lg:flex-row lg:gap-x-6">
                          {data.result.votes.map(
                            (item: { x: string; abs: number; perc: number }) => (
                              <div className="flex flex-wrap gap-3 whitespace-nowrap" key={item.x}>
                                <p className="w-28 md:w-fit">{t(item.x)}:</p>
                                <div className="flex flex-wrap items-center gap-3">
                                  <BarPerc hidden value={item.perc} size={"h-[5px] w-[50px]"} />
                                  <p>{`${
                                    item.abs !== null ? numFormat(item.abs, "standard") : "—"
                                  } ${
                                    item.perc !== null
                                      ? `(${numFormat(item.perc, "compact", [1, 1])}%)`
                                      : "(—)"
                                  }`}</p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {options.length > 1 && (
                      <div className="space-y-3">
                        {options && options?.length <= 10 && (
                          <div className="flex flex-row items-center justify-center gap-1.5">
                            {options?.map((option, index) => (
                              <Button
                                key={index}
                                onClick={() =>
                                  onChange(option).then(item => {
                                    if (!item) return;
                                    setData("index", index);
                                    setData("result", item);
                                  })
                                }
                                disabled={index === data.index}
                                className={clx(
                                  "h-1 w-5 rounded-md",
                                  index === data.index
                                    ? "bg-black dark:bg-white"
                                    : "bg-outline hover:bg-washed dark:bg-outlineHover-dark dark:hover:bg-washed-dark"
                                )}
                              />
                            ))}
                          </div>
                        )}
                        {options.length > 1 && (
                          <div className="flex items-center justify-center gap-4 text-sm font-medium">
                            <Button
                              className="btn-disabled btn-default"
                              onClick={() =>
                                onChange(options[data.index - 1]).then(item => {
                                  if (!item) return;
                                  setData("index", data.index - 1);
                                  setData("result", item);
                                })
                              }
                              disabled={data.index === 0}
                            >
                              <ChevronLeftIcon className="h-4.5 w-4.5" />
                              {t("common:common.previous")}
                            </Button>
                            {options.length > 10 && (
                              <span className="flex items-center gap-1 text-center text-sm">
                                {`${data.index + 1} / ${options.length}`}
                              </span>
                            )}
                            <Button
                              className="btn-disabled btn-default"
                              onClick={() =>
                                onChange(options[data.index + 1]).then(item => {
                                  if (!item) return;
                                  setData("index", data.index + 1);
                                  setData("result", item);
                                })
                              }
                              disabled={data.index === options.length - 1}
                            >
                              {t("common:common.next")}
                              <ChevronRightIcon className="h-4.5 w-4.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ElectionCard;
