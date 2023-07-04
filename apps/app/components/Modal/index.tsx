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

        <div className="fixed inset-0 pt-[15%]">
          <div className="block h-full">
            <Dialog.Panel
              className={clx(
                Font.body.variable,
                "absolute bottom-0 mx-auto flex w-full flex-col rounded-t-xl bg-white font-sans dark:bg-black"
              )}
            >
              <div className="relative">
                <div className="dark:border-outlineHover-dark sticky top-0 flex w-full justify-between border-b p-3">
                  <Dialog.Title as="h5">{title}</Dialog.Title>
                  <XMarkIcon
                    onClick={() => setOpen(false)}
                    className="text-dim h-5 w-5 self-center"
                  />
                </div>
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
