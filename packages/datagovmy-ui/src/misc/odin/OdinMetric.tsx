import { FunctionComponent, MutableRefObject, useMemo } from "react";
import { At, Section } from "../../components";
import Table, { TableConfig } from "../../charts/table";

type OdinMetricProps = {
  title: string;
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
};

const OdinMetric: FunctionComponent<OdinMetricProps> = ({ title, scrollRef }) => {
  const data = useMemo(
    () => [
      {
        firstColumn: "Row 1",
        secondColumn: ["A1", "A2", "A3", "A4"],
        thirdColumn: ["B1", "B2", "B3", "B4"],
        fourthColumn: ["C1", "C2", "C3", "C4"],
      },
      {
        firstColumn: "Row 2",
        secondColumn: ["A1", "A2", "A3", "A4"],
        thirdColumn: ["B1", "B2", "B3", "B4"],
        fourthColumn: ["C1", "C2", "C3", "C4"],
      },
    ],
    []
  );

  const dummyRefDatasets: Array<Record<"id" | "title" | "url", string>> = [
    {
      id: "population_population_malaysia",
      title: "Population Table: Malaysia",
      url: "",
    },
    {
      id: "population_population_state",
      title: "Population Table: States",
      url: "",
    },
    {
      id: "population_population_district",
      title: "Population Table: Administrative Districts",
      url: "",
    },
    {
      id: "healthcare_covid_cases_vaxstatus",
      title: "Daily COVID-19 Cases by State and Vaccination Status",
      url: "",
    },
    {
      id: "healthcare_covid_cases",
      title: "Daily COVID-19 Cases by State",
      url: "",
    },
    {
      id: "healthcare_covid_cases_age",
      title: "Daily COVID-19 Cases by State and Age Group",
      url: "",
    },
  ];

  const columns: TableConfig<typeof data>[] = [
    {
      header: "Element",
      id: "firstColumn",
      accessorKey: "firstColumn",
      enableSorting: false,
    },
    {
      header: "Sub-element",
      id: "secondColumn",
      className: "border-l p-0",
      accessorKey: "secondColumn",
      enableSorting: false,
      cell: ({ getValue }) => {
        return (
          <ul className="flex w-full flex-col">
            {getValue().map((item: any, index: number, arr: any) => (
              <li
                className={
                  index < arr.length - 1 ? "min-h-[48px] border-b p-2" : "min-h-[48px] p-2"
                }
                key={index}
              >
                {item}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      header: "Score",
      id: "thirdColumn",
      className: "p-0",
      accessorKey: "thirdColumn",
      enableSorting: false,
      cell: ({ getValue }) => {
        return (
          <ul>
            {getValue().map((item: any, index: number, arr: any) => (
              <li
                className={
                  index < arr.length - 1 ? "min-h-[48px] border-b p-2" : "min-h-[48px] p-2"
                }
                key={index}
              >
                {item}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      header: "Justification",
      id: "fourthColumn",
      className: "p-0",
      accessorKey: "fourthColumn",
      enableSorting: false,
      cell: ({ getValue }) => {
        return (
          <ul>
            {getValue().map((item: any, index: number, arr: any) => (
              <li
                className={
                  index < arr.length - 1 ? "min-h-[48px] border-b p-2" : "min-h-[48px] p-2"
                }
                key={index}
              >
                {item}
              </li>
            ))}
          </ul>
        );
      },
    },
  ];

  return (
    <Section className="border-b py-8 lg:py-12" ref={ref => (scrollRef.current[title] = ref)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <h4>{title}</h4>
        </div>
        <div className="flex items-center gap-8 pb-6">
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-dim font-medium uppercase">overall score</p>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl">10</h1>
              <p className="text-dim">out of 10</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-dim font-medium uppercase">overall score</p>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl text-orange-500">5</h1>
              <p className="text-dim">out of 5</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-dim font-medium uppercase">overall score</p>
            <div className="flex items-center gap-1.5">
              <h1 className="text-primary text-2xl">5</h1>
              <p className="text-dim">out of 5</p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Table
            className="md:mx-auto md:w-4/5 lg:w-full"
            data={data}
            config={columns}
            enablePagination={false}
          />
        </div>

        <div className="flex gap-6">
          <p className="w-content text-sm font-medium">Reference Datasets:</p>
          <div className="flex flex-1 flex-wrap gap-x-3 gap-y-6">
            {dummyRefDatasets.map(dataset => (
              <At
                className="link-primary text-sm font-normal underline"
                href={`data-catalogue/${dataset.id}`}
                target="_blank"
              >
                {dataset.title}
              </At>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default OdinMetric;
