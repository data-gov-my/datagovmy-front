import { Dispatch, FunctionComponent, ReactElement, SetStateAction, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface ModalProps {
  trigger?: (open: Function) => ReactElement;
  children: (close: Function) => ReactElement | ReactElement[];
  title?: string | ReactElement;
}

const Modal: FunctionComponent<ModalProps> = ({ trigger, title, children }) => {
  let [open, setOpen] = useState(false);

  return (
    <>
      {trigger && trigger(() => setOpen(true))}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="mx-auto w-full max-w-sm space-y-4 rounded bg-white p-4">
              <div className="flex justify-between">
                <Dialog.Title as="h4" className="text-black">
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
