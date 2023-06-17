import { statesOptions } from "../../lib/options";
import Link from "next/link";
import Image from "next/image";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import Modal from ".";
import { WindowContext } from "../../hooks/useWindow";
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
            "fixed bottom-0 right-4 z-30 block h-14 w-14 transform rounded-[50%] border bg-white shadow-2xl transition-all lg:hidden",
            show ? "-translate-y-4" : "translate-y-12"
          )}
          onClick={() => open()}
        >
          <Image
            src={"/static/images/states/".concat(currentState, ".jpeg")}
            height={16}
            width={28}
            alt={currentState}
          />
        </button>
      )}
      title={title ?? t("common:common.check_out")}
    >
      {close => (
        <ul className="space-y-2">
          {statesOptions
            .filter(option => !exclude?.includes(option.value))
            .map(state => (
              <li
                key={state.value}
                className={`rounded px-2 py-1 ${state.value === currentState ? "bg-washed" : ""}`}
              >
                <Link
                  href={url.concat("/", state.value !== "mys" ? state.value : "")}
                  scroll={false}
                  onClick={() => close()}
                >
                  <Image
                    src={"/static/images/states/".concat(state.value, ".jpeg")}
                    height={16}
                    width={28}
                    alt={state.value}
                  />
                  <span>{state.label}</span>
                </Link>
              </li>
            ))}
        </ul>
      )}
    </Modal>
  );
};

export default StateModal;
