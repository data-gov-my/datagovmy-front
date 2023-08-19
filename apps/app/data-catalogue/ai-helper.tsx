import Chat from "@components/Chat";
import Filetree from "@components/Filetree";
import { FileNode, FileType, FiletreeProvider } from "@components/Filetree/utils";
import { BuildingLibraryIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import {
  AgencyBadge,
  At,
  Button,
  Checkbox,
  Container,
  Daterange,
  Dropdown,
  Hero,
  Label,
  Modal,
  Radio,
  Search,
  Section,
  Sidebar,
} from "datagovmy-ui/components";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { useFilter, useTranslation } from "datagovmy-ui/hooks";
import { Agency, OptionType } from "datagovmy-ui/types";
import {
  FunctionComponent,
  useMemo,
  useRef,
  ForwardRefExoticComponent,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
  useContext,
} from "react";

/**
 * Catalogue Index
 * @overview Status: Live
 */

export type Catalogue = {
  id: string;
  catalog_name: string;
};

interface CatalogueChatProps {
  //   query: Record<string, string>;
  //   collection: Record<string, any>;
  //   sources: string[];
}

const CatalogueChat: FunctionComponent<CatalogueChatProps> = () => {
  const { t } = useTranslation(["catalogue", "common"]);

  return (
    <FiletreeProvider model="chat-directory">
      <Container>
        <div className="flex w-full flex-col lg:flex-row">
          <Filetree />
          <Chat model="chat-history" />
        </div>
      </Container>
    </FiletreeProvider>
  );
};

export default CatalogueChat;
