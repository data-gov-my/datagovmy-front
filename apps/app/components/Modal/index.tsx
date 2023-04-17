import { FunctionComponent, ReactElement, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { clx } from "@lib/helpers";
import Font from "@config/font";

interface ModalProps {
  trigger?: (open: () => void) => ReactElement;
  children: (value: () => void) => ReactElement | ReactElement[];
  title?: string | ReactElement;
}

const Modal: FunctionComponent<ModalProps> = ({ trigger, title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {trigger && trigger(() => setOpen(true))}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 pt-[15%] ">
          <div className={clx("block h-full lg:p-4")}>
            <Dialog.Panel
              className={clx(
                Font.body.variable,
                "absolute bottom-0 mx-auto flex w-full flex-col rounded bg-white px-4 pt-4 font-sans dark:bg-black"
              )}
            >
              <div className="dark:border-outlineHover-dark flex justify-between border-b bg-white pb-2 dark:bg-black">
                <Dialog.Title as="h4" className="text-black dark:text-white ">
                  {title}
                </Dialog.Title>
                <XMarkIcon onClick={() => setOpen(false)} className="text-dim h-5 w-5" />
              </div>

              {children(() => setOpen(false))}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
