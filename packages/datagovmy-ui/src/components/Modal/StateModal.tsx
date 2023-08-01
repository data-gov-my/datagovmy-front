import { statesOptions } from "../../lib/options";
import Link from "next/link";
import Image from "next/image";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import Modal from ".";
import { WindowContext } from "../../contexts/window";
import { useTranslation } from "../../hooks/useTranslation";
import { clx } from "../../lib/helpers";

interface StateModalProps {
  state: string;
  exclude?: string[];
  url: string;
  title?: string;
}

const StateModal: FunctionComponent<StateModalProps> = ({ state, exclude, url, title }) => {
  const { scroll } = useContext(WindowContext);
  const currentState = state || "mys";
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [lastPosition, setLastPosition] = useState(scroll.y);

  useEffect(() => {
    if (lastPosition > scroll.y) setShow(true);
    else setShow(false);

    setLastPosition(scroll.y);
  }, [scroll.y]);

  return (
    <Modal
      trigger={open => (
        <button
          className={clx(
            "border-outline dark:border-outlineHover-dark fixed bottom-0 right-4 z-30 flex h-14 w-14 transform items-center justify-center rounded-full border bg-white shadow-2xl transition-all dark:bg-black lg:hidden",
            show ? "-translate-y-4" : "translate-y-12"
          )}
          onClick={() => open()}
        >
          <Image
            src={"/static/images/states/".concat(currentState, ".jpeg")}
            height={15}
            width={27}
            alt={currentState}
          />
        </button>
      )}
      title={title ?? t("common:common.check_out")}
    >
      {close => (
        <ul className="max-h-96 overflow-y-auto">
          {statesOptions
            .filter(option => !exclude?.includes(option.value))
            .map(state => (
              <li
                key={state.value}
                className={clx(
                  "mt-1 px-4 py-2",
                  state.value === currentState && "bg-washed dark:bg-washed-dark"
                )}
              >
                <Link
                  href={url.concat("/", state.value !== "mys" ? state.value : "")}
                  scroll={false}
                  onClick={() => close()}
                >
                  <div className="flex gap-2">
                    <Image
                      style={{ objectFit: "contain" }}
                      src={"/static/images/states/".concat(state.value, ".jpeg")}
                      height={16}
                      width={28}
                      alt={state.value}
                    />
                    <span className="text-sm">{state.label}</span>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      )}
    </Modal>
  );
};

export default StateModal;
