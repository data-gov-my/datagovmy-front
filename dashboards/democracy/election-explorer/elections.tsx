import { Section } from "@components/index";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Election Explorer Dashboard - Elections Tab
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

interface ElectionProps {}

const Election: FunctionComponent<ElectionProps> = ({}) => {
  return (
    <>
      <Section>
        <div className="grid grid-cols-12">
          <div className="col-span-10 col-start-2">
            <h4 className="py-4 text-center">Explore any election from Merdeka to the present!</h4>
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid grid-cols-12">
          <div className="col-span-10 col-start-2">
            <h4 className="py-4 text-center">View the full ballot for a specific seat</h4>
            <Table></Table>
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid grid-cols-12">
          <div className="col-span-10 col-start-2">
            <h4 className="py-4 text-center">Election analysis</h4>
            <Choropleth></Choropleth>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Election;
