import Chat from "@components/Chat";
import Filetree from "@components/Filetree";
import { FiletreeProvider } from "@components/Filetree/utils";
import { Container } from "datagovmy-ui/components";
import { FunctionComponent } from "react";

/**
 * DataGPT
 * @overview Status: Phase 1
 * @summary
 * Phase 1: Dataset and dashboard discovery
 * - Help users find datasets available, point them to DC or dashboards page
 * - Dependencies: Metadata and descriptions for each dataset and dashboard
 *
 * Phase 2: Data query and insights
 * - Ask a general data question, get a descriptive text response. eg. "top 5 richest districts in Malaysia"
 * - For this, we may initially want to pick a subset of datasets supported (eg. census and elections), then later scale up to the full DC
 * - Dependencies: Query interface to datasets (either via open API or SQL)
 *
 * Phase 3: Rich data query and insights
 * - Phase 2, plus ability to return tabular data or chart data or map data based on type of query
 */
interface CatalogueDataGPTProps {}

const CatalogueDataGPT: FunctionComponent<CatalogueDataGPTProps> = () => {
  return (
    <FiletreeProvider model="chat-directory">
      <Container>
        <div className="flex w-full flex-col lg:flex-row">
          <Filetree />
          <Chat model="chat-history" chain="main" />
        </div>
      </Container>
    </FiletreeProvider>
  );
};

export default CatalogueDataGPT;
