import { Fragment, FunctionComponent, ReactElement, useState } from "react";
import { Button } from "..";
import ElectionTable from "@components/Chart/Table/ElectionTable";
import Font from "@config/font";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { Dialog, Transition } from "@headlessui/react";
import { clx, numFormat } from "@lib/helpers";

interface CardProps {
  open: boolean;
  onChange: (index: number) => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  data?: any;
  columns?: any;
  votes?: any;
  title?: string | ReactElement;
  win?: string;
  date?: string;
  election_name: string;
  isLoading: boolean;
  highlightedRow?: false | number;
  page: number;
  total: number;
}

const Card: FunctionComponent<CardProps> = ({
  open,
  onChange,
  onClose,
  onNext,
  onPrev,
  data,
  columns,
  votes,
  title,
  win,
  date,
  election_name,
  isLoading,
  highlightedRow,
  page,
  total,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);
  const [e, num] = getElectionTrans(election_name);

  return (
    <>
      <Transition appear show={isOpen} as={"div"}>
        <Dialog as="div" className="relative z-30" onClose={onClose}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                    "font-sans",
                    "border-outline dark:border-outlineHover-dark border",
                    "w-full max-w-4xl transform overflow-hidden rounded-xl bg-white px-3 py-6 text-left align-middle shadow-xl transition-all dark:bg-black md:px-6"
                  )}
                >
                  <Dialog.Title as="h5" className="flex flex-row">
                    <div>{title && typeof title === "string" ? <span>{title}</span> : title}</div>
                  </Dialog.Title>
                  <button
                    className="hover:bg-washed dark:hover:bg-washed-dark group absolute right-2 top-2 h-12 w-12 rounded-full"
                    onClick={() => {
                      onClose();
                      setIsOpen(false);
                    }}
                  >
                    <XMarkIcon className="text-dim absolute right-2 top-3 h-6 w-6 lg:right-3" />
                  </button>
                  <div className="space-y-6">
                    <div className="space-x-3 pt-2">
                      {date ? <span className="text-dim">{date}</span> : <></>}
                      <span className="uppercase text-black dark:text-white">
                        {num ? t(e).concat("-" + num) : t(e)}
                      </span>
                    </div>
                    <ElectionTable
                      data={data}
                      columns={columns}
                      isLoading={isLoading}
                      highlightedRow={highlightedRow}
                      win={win}
                    />

                    {isLoading ? (
                      <></>
                    ) : (
                      votes && (
                        <div className="flex flex-col justify-center gap-1 text-sm md:flex-row md:gap-3 ">
                          <p>
                            <span>{t("election.voter_turnout")}:</span>
                            <span className="font-medium">{` ${numFormat(
                              votes.voter_turnout,
                              "standard"
                            )} (${numFormat(votes.voter_turnout_perc, "compact", [1, 1])}%)`}</span>
                          </p>
                          <p>
                            <span>{t("election.rejected_votes")}:</span>
                            <span className="font-medium">{` ${numFormat(
                              votes.votes_rejected,
                              "standard"
                            )} (${numFormat(
                              votes.votes_rejected_perc,
                              "compact",
                              [1, 1]
                            )}%)`}</span>
                          </p>
                        </div>
                      )
                    )}
                    <div className="space-y-3">
                      {total <= 10 && (
                        <div className="flex flex-row items-center justify-center gap-1.5">
                          {Array(total)
                            .fill(null)
                            .map((num, index: number) => (
                              <button
                                onClick={() => onChange(index)}
                                disabled={index === page}
                                className={clx(
                                  "h-1 w-5 rounded-md",
                                  index === page
                                    ? "bg-black dark:bg-white"
                                    : "bg-outline hover:bg-washed dark:bg-outlineHover-dark dark:hover:bg-washed-dark"
                                )}
                              ></button>
                            ))}
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <Button
                          className="disabled:bg-washed dark:disabled:bg-washed-dark hover:bg-outline dark:hover:bg-washed-dark group flex flex-row gap-2 rounded border px-3 py-2 dark:border-none"
                          onClick={onPrev}
                          disabled={page === 0}
                        >
                          <ChevronLeftIcon className="h-4 w-4 text-black dark:text-white" />
                          {t("common:common.previous")}
                        </Button>
                        {total > 10 && (
                          <span className="flex items-center gap-1 text-center text-sm">
                            {`${page + 1} / ${total}`}
                          </span>
                        )}
                        <Button
                          className="disabled:bg-washed dark:disabled:bg-washed-dark hover:bg-outline dark:hover:bg-washed-dark group flex flex-row gap-2 rounded border px-3 py-2 dark:border-none"
                          onClick={onNext}
                          disabled={page === total - 1}
                        >
                          {t("common:common.next")}{" "}
                          <ChevronRightIcon className="h-4 w-4 text-black dark:text-white" />
                        </Button>
                      </div>
                    </div>
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

export default Card;

export function getElectionTrans(input: string): any[] {
  if (!input) return [];
  const e = input.split("-");
  const num = e[1].match(/\d+/g);
  return [e[0], num];
}
