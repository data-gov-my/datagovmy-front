import { Fragment, FunctionComponent, useRef, useState, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

// import { FunctionComponent, ReactElement, useState } from "react";
// import { Dialog } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/solid";
// import Font from "config/font";

interface ModalProps {
  trigger?: (open: () => void) => ReactNode;
  children: (value: () => void) => ReactNode;
  title?: ReactNode;
}

// const Modal: FunctionComponent<ModalProps> = ({ trigger, title, children }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <div>
//       {trigger && trigger(() => setOpen(true))}
//       <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
//         <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

//         <div className="fixed inset-0 pt-[15%] ">
//           <div className="block h-full lg:p-4">
//             <Dialog.Panel
//               className={[
//                 Font.body.className,
//                 "absolute bottom-0 mx-auto flex w-full flex-col rounded bg-white px-4 pt-4 font-sans dark:bg-black lg:bottom-[unset] lg:top-[20%] lg:w-max lg:max-w-[40%] lg:translate-x-1/2",
//               ].join(" ")}
//             >
//               <div className="dark:border-outlineHover-dark flex justify-between border-b bg-white pb-2 dark:bg-black">
//                 <Dialog.Title as="h4" className="text-black dark:text-white ">
//                   {title}
//                 </Dialog.Title>
//                 <XMarkIcon onClick={() => setOpen(false)} className="text-dim h-5 w-5" />
//               </div>

//               {children(() => setOpen(false))}
//             </Dialog.Panel>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

const Modal: FunctionComponent<ModalProps> = ({ trigger, children, title }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {trigger && trigger(() => setOpen(true))}
      <Transition.Root show={open} as={"div"}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 ">
                        {title}
                      </Dialog.Title>
                      <div className="mt-2">{children(() => setOpen(false))}</div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};
export default Modal;
