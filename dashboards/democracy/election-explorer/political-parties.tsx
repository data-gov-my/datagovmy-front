import { Section } from "@components/index";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Election Explorer Dashboard - Political Parties Tab
 * @overview Status: In-development
 */

const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

interface ElectionPartiesProps {}

const ElectionParties: FunctionComponent<ElectionPartiesProps> = ({}) => {
  return (
    <Section>
      <div className="grid grid-cols-12">
        <div className="col-span-10 col-start-2">
          <Table></Table>
        </div>
      </div>
    </Section>
  );
};

export default ElectionParties;
