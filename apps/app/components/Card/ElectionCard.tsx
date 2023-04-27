import { Fragment, FunctionComponent, ReactElement, useState } from "react";
import { Button } from "..";
import BorderlessTable from "@components/Chart/Table/BorderlessTable";
import Font from "@config/font";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { Dialog, Transition } from "@headlessui/react";
import { clx } from "@lib/helpers";

interface CardProps {
  open: boolean;
  onChange: (index: number) => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  data?: any;
  columns?: any;
  title?: string | ReactElement;
  win?: string;
  date: string;
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
                    "w-full max-w-4xl transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black"
                  )}
                >
                  <Dialog.Title as="h5" className="flex flex-row">
                    <div>{title && typeof title === "string" ? <span>{title}</span> : title}</div>
                  </Dialog.Title>
                  <XMarkIcon
                    onClick={() => {
                      onClose();
                      setIsOpen(false);
                    }}
                    className="text-dim absolute right-4 top-4 h-6 w-6 cursor-pointer items-center"
                  />
                  <div className="space-x-3 pt-3">
                    <span className="text-dim">{date}</span>
                    <span className="uppercase text-black dark:text-white">{election_name}</span>
                  </div>
                  <BorderlessTable
                    data={data}
                    columns={columns}
                    isLoading={isLoading}
                    highlightedRow={highlightedRow}
                    win={win}
                  />

                  <div className="mt-6 space-y-3">
                    <div className="flex flex-row items-center justify-center gap-1.5">
                      {[...Array(total)].map((num, index: number) => (
                        <button
                          onClick={() => onChange(index)}
                          className={clx(
                            "h-1 w-5 rounded-md",
                            index === page
                              ? "bg-black dark:bg-white"
                              : "bg-outline dark:bg-outlineHover-dark"
                          )}
                        ></button>
                      ))}
                    </div>
                    <div className={`flex items-center justify-center gap-4 text-sm`}>
                      <Button
                        className="disabled:bg-washed dark:disabled:bg-washed-dark group flex flex-row gap-2 rounded border px-3 py-2"
                        onClick={onPrev}
                        disabled={page === 0}
                      >
                        <ChevronLeftIcon className="h-4 w-4 text-black dark:text-white" />
                        {t("common:common.previous")}
                      </Button>
                      <Button
                        className="disabled:bg-washed dark:disabled:bg-washed-dark group flex flex-row gap-2 rounded border px-3 py-2"
                        onClick={onNext}
                        disabled={page === total - 1}
                      >
                        {t("common:common.next")}{" "}
                        <ChevronRightIcon className="h-4 w-4 text-black dark:text-white" />
                      </Button>
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
