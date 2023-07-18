import CodeBlock from "@components/CodeBlock";
import Dropdown from "@components/Dropdown";
import Modal, { ModalInterface } from "@components/Modal";
import Tabs, { Panel } from "@components/Tabs";
import { useData } from "@hooks/useData";
import { FilterDefault } from "@lib/types";
import {
  ForwardRefExoticComponent,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { isOptionType } from "@components/types";

export interface EmbedInterface {
  open: () => void;
}

interface CatalogueEmbedProps {
  uid: string;
  options?: FilterDefault[] | null;
  defaultOption?: any;
  translations?: any;
  ref: ForwardedRef<EmbedInterface>;
}

const CatalogueEmbed: ForwardRefExoticComponent<CatalogueEmbedProps> = forwardRef(
  ({ uid, options, defaultOption, translations }, ref) => {
    const modalRef = useRef<ModalInterface>(null);
    const { data, setData } = useData(defaultOption);
    useImperativeHandle(ref, () => ({ open: modalRef.current!.open }));

    const EMBED_URL = useMemo<string>(() => {
      const url = new URL(`http://localhost:3000/data-catalogue/embed/${uid}`);
      const search_params = new URLSearchParams(
        Object.entries(data).map(([key, value]: [string, unknown]) => {
          if (isOptionType(value)) return [key, value.value];
          return [key, value as string];
        })
      );
      url.search = search_params.toString();
      return url.href;
    }, [uid, data]);

    return (
      <Modal ref={modalRef} title="Embed" className="lg:max-w-screen-xl">
        {() => (
          <div className="grid w-full grid-cols-3 gap-3 ">
            <div className="dark:bg-outlineHover-dark col-span-2 bg-slate-50 px-6 py-3 lg:rounded-s-xl">
              <Tabs className="h-fit">
                <Panel name={"Desktop"}>
                  <div className="flex flex-col items-start">
                    <iframe
                      src={EMBED_URL}
                      className="dark:border-outlineHover-dark mx-auto mt-2 rounded border bg-white"
                      style={{
                        height: "500px",
                        width: "100%",
                        overflow: "hidden",
                      }}
                    />
                  </div>
                </Panel>
                <Panel name={"Mobile"}>
                  <iframe
                    src={EMBED_URL}
                    className="mx-auto mt-2 rounded border bg-white"
                    style={{
                      height: "500px",
                      width: "320px",
                      overflow: "hidden",
                    }}
                  />
                </Panel>
              </Tabs>
            </div>

            <div className="flex flex-col justify-between p-3">
              <div>
                <h5>Configuration</h5>
                <div className="flex w-full flex-col gap-2">
                  {options?.map((item: FilterDefault, index: number) => (
                    <div className="flex w-full items-center justify-between">
                      <p className="font-mono text-sm">{item.key}</p>
                      <Dropdown
                        key={item.key}
                        width="w-fit"
                        anchor={"right"}
                        options={item.options.map(option => ({
                          label: translations[option] ?? option,
                          value: option,
                        }))}
                        selected={data[item.key]}
                        onChange={e => setData(item.key, e)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5>Embed Code</h5>
                <CodeBlock>
                  {`<iframe
    src="${EMBED_URL}"
    width="100%"
    className="mx-auto mt-2 rounded border"
    style={{
    height: "500px",
    width: "320px",
    overflow: "hidden",
    background: "white",
    }}
/>
                `}
                </CodeBlock>
              </div>
            </div>
          </div>
        )}
      </Modal>
    );
  }
);

CatalogueEmbed.displayName = "CatalogueEmbed";

export default CatalogueEmbed;
