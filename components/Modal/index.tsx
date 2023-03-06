import { Dispatch, FunctionComponent, ReactElement, SetStateAction, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface ModalProps {
  trigger?: (open: () => void) => ReactElement;
  children: (value: () => void) => ReactElement | ReactElement[];
  title?: string | ReactElement;
  fullScreen?: boolean;
}

const Modal: FunctionComponent<ModalProps> = ({ trigger, title, children, fullScreen }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {trigger && trigger(() => setOpen(true))}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 pt-[15%] ">
          <div className={`block h-full ${!fullScreen ? "lg:p-4" : ""}`}>
            <Dialog.Panel
              className={`mx-auto flex w-full flex-col ${
                !fullScreen ? "max-w-sm" : "h-full"
              } rounded bg-white px-4 pt-4`}
            >
              <div className="flex justify-between border-b bg-white pb-2">
                <Dialog.Title as="h4" className="text-black ">
                  {title}
                </Dialog.Title>
                <XMarkIcon onClick={() => setOpen(false)} className="h-5 w-5 text-dim" />
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
