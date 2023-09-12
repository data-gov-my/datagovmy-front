import { FilterDefault } from "../../../types";
import { OptionType, isOptionType } from "./types";
import { CodeBlock, Dropdown, Modal, ModalInterface, Panel, Tabs } from "../../components";
import { useData, useTranslation, useWatch } from "../../hooks";
import { languages } from "../../lib/options";
import {
  ForwardRefExoticComponent,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { get } from "../../lib/api";

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
    const { t, i18n } = useTranslation(["catalogue"]);
    const { data, setData } = useData(defaultOption);
    const [filters, setFilters] = useState<FilterDefault[] | null | undefined>(options);
    const [language, setLanguage] = useState<OptionType | undefined>(
      languages.find(item => item.value === i18n.language)
    );
    useImperativeHandle(ref, () => ({ open: modalRef.current!.open }));

    const EMBED = useMemo<{ url: string; params: URLSearchParams }>(() => {
      const embed = new URL(
        `${process.env.NEXT_PUBLIC_APP_URL}${
          language?.value === "ms-MY" ? "/ms-MY" : ""
        }/data-catalogue/embed/${uid}`
      );
      const search_params = new URLSearchParams(
        Object.entries(data)
          .filter(([_, value]) => !!value)
          .map(([key, value]: [string, unknown]) => {
            if (isOptionType(value)) return [key, value.value];
            return [key, value as string];
          })
      );

      embed.search = search_params.toString();

      return { url: embed.href, params: search_params };
    }, [uid, data, language]);

    const _setData = (key: string, value: any) => {
      let flag = false;
      for (const _key in data) {
        if (flag && _key !== "range") setData(_key, undefined);
        if (key === _key) {
          setData(key, value);
          flag = true;
        }
      }
    };

    useWatch(() => {
      get(
        "/api/embed",
        { id: uid, lang: i18n.language, ...Object.fromEntries(EMBED.params) },
        "app"
      ).then(res => {
        const { options } = res.data;
        if (options && options !== null) setFilters(options);
      });
    }, [EMBED.params]);

    return (
      <Modal ref={modalRef} title={<h4>{t("embed")}</h4>} className="lg:max-w-screen-xl">
        {() => (
          <div className="grid w-full grid-cols-1 bg-white dark:bg-black lg:grid-cols-3 lg:rounded-b-xl">
            <div className="col-span-2 hidden bg-slate-50 px-6 py-3 dark:bg-black lg:block lg:rounded-bl-xl">
              <Tabs className="h-fit">
                <Panel name={t("desktop")}>
                  <div className="flex flex-col items-start">
                    <iframe
                      src={EMBED.url}
                      className="dark:border-outlineHover-dark mx-auto mt-2 rounded border bg-white"
                      style={{
                        height: "500px",
                        width: "100%",
                        overflow: "hidden",
                      }}
                      data-testid="catalogue-embed-frame"
                    />
                  </div>
                </Panel>
                <Panel name={t("mobile")}>
                  <iframe
                    src={EMBED.url}
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

            <div className="flex flex-col gap-6 p-3">
              <div>
                <h5>{t("settings")}</h5>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <p className="font-mono text-sm">language</p>
                    <Dropdown
                      width="w-fit"
                      selected={languages.find(lang => lang.value === language?.value)}
                      onChange={e => setLanguage(e)}
                      options={languages}
                    />
                  </div>
                  {filters?.map((item: FilterDefault, index: number) => (
                    <div className="flex w-full items-center justify-between" key={item.key}>
                      <p className="font-mono text-sm">{item.key}</p>
                      <Dropdown
                        key={item.key}
                        width="w-fit"
                        anchor="right"
                        options={item.options.map(option => ({
                          label: translations[option] ?? option,
                          value: option,
                        }))}
                        selected={data[item.key]}
                        onChange={e => _setData(item.key, e)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5>{t("embed_code")}</h5>
                <CodeBlock hidden data-testid="catalogue-embed-code">
                  {{
                    html: `<iframe src="${EMBED.url}" width="100%" height="400px" />`,
                  }}
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
