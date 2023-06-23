import { statesOptions } from "@lib/options";
import { routes } from "@lib/routes";
import Link from "next/link";
import Image from "next/image";
import { FunctionComponent, useEffect, useState } from "react";
import Modal from ".";
import { useRouter } from "next/router";
import { useWindowScroll } from "@hooks/useWindowWidth";
import { useTranslation } from "@hooks/useTranslation";

interface StateModalProps {
  exclude?: string[];
  url: string;
  title?: string;
}

const StateModal: FunctionComponent<StateModalProps> = ({ exclude, url, title }) => {
  const router = useRouter();
  const scroll = useWindowScroll();
  const currentState = (router.query.state as string) ?? "mys";
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [lastPosition, setLastPosition] = useState(scroll.scrollY);

  useEffect(() => {
    if (lastPosition > scroll.scrollY) setShow(true);
    else setShow(false);

    setLastPosition(scroll.scrollY);
  }, [scroll.scrollY]);

  return (
    <Modal
      trigger={open => (
        <button
          className={`fixed bottom-0 right-4 z-30 block h-14 w-14 transform rounded-[50%] border bg-white shadow-2xl transition-all lg:hidden ${
            show ? "-translate-y-4" : "translate-y-12"
          }`}
          onClick={() => open()}
        >
          <Image
            src={"/static/images/states/".concat(currentState, ".jpeg")}
            height={16}
            width={28}
          />
        </button>
      )}
      title={title ?? t("common.check_out")}
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
                >
                  <a className="flex items-center space-x-4" onClick={() => close()}>
                    <Image
                      src={"/static/images/states/".concat(state.value, ".jpeg")}
                      height={16}
                      width={28}
                    />
                    <span>{state.label}</span>
                  </a>
                </Link>
              </li>
            ))}
        </ul>
      )}
    </Modal>
  );
};

export default StateModal;
