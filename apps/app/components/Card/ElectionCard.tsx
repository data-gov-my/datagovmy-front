import { Fragment, FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { Button } from "..";
import Font from "@config/font";
import {
  ArrowsPointingOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { Dialog, Transition } from "@headlessui/react";
import { clx, numFormat } from "@lib/helpers";
import { BarMeter } from "@components/Chart/Table/BorderlessTable";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { PoliticalParty, PoliticalPartyColours } from "@lib/constants";
import Image from "next/image";

interface CardProps {
  data?: Candidate[];
  title?: string | ReactElement;
  children: ReactNode;
  label: string;
  page?: number;
  win?: ReactNode;
}

const Card: FunctionComponent<CardProps> = ({
  data = dummyData,
  title,
  children,
  label,
  page = 0,
  win,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-center justify-center">
        <Button
          className="flex flex-row items-center gap-1.5 px-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => setIsOpen(true)}
        >
          <ArrowsPointingOutIcon className="h-4 w-4 text-black dark:text-white" />
          <p className="whitespace-nowrap">{label}</p>
        </Button>
      </div>

      <Transition appear show={isOpen} as={"div"}>
        <Dialog as="div" className="relative z-30" onClose={() => setIsOpen(false)}>
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
                  <span>{win}</span>
                  <XMarkIcon
                    onClick={() => setIsOpen(false)}
                    className="text-dim absolute right-4 top-4 h-6 w-6 cursor-pointer items-center"
                  />
                  <div className="space-x-3 py-3">
                    <span className="text-dim">23 Jan 2004</span>
                    <span className="uppercase text-black dark:text-white">GE-15</span>
                  </div>
                  <div className="relative flex h-[30px] w-full self-center rounded-md">
                    {data.map((d: Candidate, index: number) => {
                      const left = data.slice(0, index).reduce((acc, cur) => acc + cur.perc, 0);
                      return (
                        <div
                          className={clx(
                            "absolute left-0 top-0 z-40 h-full",
                            index === 0
                              ? "rounded-l-md"
                              : index === data.length - 1
                              ? "rounded-r-md"
                              : ""
                          )}
                          style={{
                            left: `${left}%`,
                            right: `${100 - d.perc - left}%`,
                            backgroundColor: PoliticalPartyColours[d.party],
                          }}
                        />
                      );
                    })}
                  </div>
                  {children}

                  <div className="mt-6 space-y-3">
                    <div className="flex flex-row items-center justify-center gap-1.5">
                      {data.map((d: Candidate, index: number) => (
                        <div
                          className={clx(
                            "h-1 w-5 rounded-md",
                            index === page ? "bg-black" : "bg-outline"
                          )}
                        ></div>
                      ))}
                    </div>
                    <div className={`flex items-center justify-center gap-4 text-sm`}>
                      <Button
                        className="disabled:bg-washed dark:disabled:bg-washed-dark group flex flex-row gap-2 rounded border px-3 py-2"
                        //   onClick={() => table.previousPage()}
                        //   disabled={!table.getCanPreviousPage()}
                      >
                        <ChevronLeftIcon className="h-4 w-4 text-black dark:text-white" />
                        {t("common.previous")}
                      </Button>
                      <Button
                        className="disabled:bg-washed dark:disabled:bg-washed-dark group flex flex-row gap-2 rounded border px-3 py-2"
                        //   onClick={() => table.nextPage()}
                        //   disabled={!table.getCanNextPage()}
                      >
                        {t("common.next")}{" "}
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

export type Candidate = {
  name: string;
  party: string;
  votes: number;
  perc: number;
};

const dummyData: Candidate[] = [
  {
    name: "Rushdan Bin Rusmi",
    party: "pn",
    votes: 24267,
    perc: 60.45,
  },
  {
    name: "Ko Chu Liang",
    party: "ph",
    votes: 11753,
    perc: 30.05,
  },
  {
    name: "Zahida Binti Zarik Khan",
    party: "bn",
    votes: 9267,
    perc: 4.5,
  },
  {
    name: "Kapt (B) Hj Mohamad Yahya",
    party: "warisan",
    votes: 7085,
    perc: 3.5,
  },
  {
    name: "Zahidi Zainul Abidin",
    party: "bebas",
    votes: 244,
    perc: 1.5,
  },
];

const columnHelper = createColumnHelper<Candidate>();

const dummyColumns: Array<ColumnDef<Candidate, any>> = [
  columnHelper.accessor("name", {
    id: "name",
    cell: (info: any) => info.getValue(),
    header: "Candidate name",
  }),
  columnHelper.accessor((row: any) => row.party, {
    id: "party",
    cell: (info: any) => {
      const party = info.getValue() as string;
      return (
        <div className="flex flex-row items-center gap-2">
          <Image
            src={`/static/images/parties/${party}.png`}
            width={28}
            height={16}
            alt={PoliticalParty[party]}
          />
          <span className="text-center">{PoliticalParty[party]}</span>
        </div>
      );
    },
    header: "Party",
  }),
  columnHelper.accessor("votes", {
    id: "votes",
    cell: (info: any) => numFormat(info.getValue(), "standard"),
    header: "Total votes",
  }),
  columnHelper.accessor("perc", {
    id: "perc",
    cell: (info: any) => (
      <div className="flex flex-row items-center gap-2">
        <BarMeter perc={info.getValue()} />
        <p>{`${numFormat(info.getValue(), "standard")}%`}</p>
      </div>
    ),
    header: "% of votes",
  }),
];
