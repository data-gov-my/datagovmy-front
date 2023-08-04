import {
  ForwardRefExoticComponent,
  ForwardedRef,
  Fragment,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { clx } from "../../lib/helpers";
import { body } from "datagovmy-ui/configs/font";

export interface ModalInterface {
  open: () => void;
  close: () => void;
}

interface ModalProps {
  className?: string;
  trigger?: (open: () => void) => ReactNode;
  children: (close: () => void) => ReactNode;
  title?: ReactNode;
  ref?: ForwardedRef<ModalInterface>;
}

const Modal: ForwardRefExoticComponent<ModalProps> = forwardRef(
  ({ trigger, title, children, className }, ref) => {
    const [show, setShow] = useState(false);
    const open = () => setShow(true);
    const close = () => setShow(false);

    useImperativeHandle(ref, () => ({ open, close }));

    return (
      <>
        {trigger && trigger(open)}
        <Transition appear show={show} as={Fragment}>
          <Dialog open={show} onClose={close} className="relative z-50">
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

            <div className="fixed inset-0 flex items-end justify-center lg:items-center">
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
                    body.variable,
                    "dark:border-washed-dark dark:bg-background-dark h-fit grow rounded-t-xl border bg-white font-sans lg:rounded-xl",
                    className
                  )}
                >
                  <div className="dark:border-washed-dark flex w-full justify-between border-b p-3">
                    <Dialog.Title as="h5">{title}</Dialog.Title>
                    <XMarkIcon onClick={close} className="text-dim h-5 w-5 self-center" />
                  </div>
                  <div className="max-h-[85vh] overflow-auto">{children(close)}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  }
);
Modal.displayName = "Modal";

export default Modal;
