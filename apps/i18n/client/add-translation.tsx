"use client";

import Modal from "components/Modal";
import { FunctionComponent } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";

interface AddTranslationProps {}

const AddTranslation: FunctionComponent<AddTranslationProps> = () => {
  return (
    <Modal
      trigger={open => (
        <button onClick={open} className="hover:bg-outlineHover-dark block">
          <PlusIcon className="hover:bg-outlineHover-dark h-4 w-4" />
        </button>
      )}
      title="Add translation"
    >
      {close => <div>hello there</div>}
    </Modal>
  );
};

export default AddTranslation;
