import Filetree from "@components/Filetree";
import { FileNode, FileType } from "@components/Filetree/utils";
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
  //   const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  //   const filterRef = useRef<CatalogueFilterRef>(null);
  //   const { size } = useContext(WindowContext);
  //   const sourceOptions = sources.map(source => ({
  //     label: source,
  //     value: source,
  //   }));

  //   const _collection = useMemo<Array<[string, any]>>(() => {
  //     const resultCollection: Array<[string, Catalogue[]]> = [];
  //     Object.entries(collection).forEach(([category, subcategory]) => {
  //       Object.entries(subcategory).forEach(([subcategory_title, datasets]) => {
  //         resultCollection.push([`${category}: ${subcategory_title}`, datasets as Catalogue[]]);
  //       });
  //     });

  //     return resultCollection;
  //   }, [collection]);

  return (
    <>
      <Container className="min-h-screen">
        <div className="flex w-full flex-row">
          {/* Desktop */}
          <div className="dark:border-r-washed-dark hidden border-r lg:block lg:w-1/4 xl:w-1/5">
            <Filetree
              model="chat-directory"
              className="top-14 flex h-[100vh] flex-col gap-2 overflow-auto pt-3"
            />
          </div>

          <div></div>
        </div>
      </Container>
    </>
  );
};

export default CatalogueChat;
