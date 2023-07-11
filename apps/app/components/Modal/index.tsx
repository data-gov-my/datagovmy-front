import { Fragment, FunctionComponent, ReactElement, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
      <Transition appear show={open} as={Fragment}>
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clx(
                  Font.body.variable,
                  "fixed bottom-0 flex w-full flex-col rounded-t-xl bg-white font-sans dark:bg-black"
                )}
              >
                <div className="dark:border-washed-dark flex w-full justify-between border-b p-3">
                  <Dialog.Title as="h5">{title}</Dialog.Title>
                  <XMarkIcon
                    onClick={() => setOpen(false)}
                    className="text-dim h-5 w-5 self-center"
                  />
                </div>
                {children(() => setOpen(false))}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
