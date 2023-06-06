import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import type { WithChildren } from "@/types";
import { css } from "@emotion/css";

interface ModalProps extends WithChildren {
  showModal: boolean;
  setShowModal: (state: boolean) => void;
}

export default function Modal({
  children,
  showModal,
  setShowModal,
}: ModalProps) {
  return (
    <>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className={css`
            overflow-y: auto;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 40;
          `}
          onClose={() => setShowModal(false)}
        >
          <div
            className={css`
              padding-left: 1rem;
              padding-right: 1rem;
              text-align: center;
              min-height: 100vh;
            `}
          >
            <Transition.Child
              as={Fragment}
              enter={css`
                transition-duration: 300ms;
                transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
              `}
              enterFrom={css`
                opacity: 0;
              `}
              enterTo={css`
                opacity: 1;
              `}
              leave={css`
                transition-duration: 200ms;
                transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
              `}
              leaveFrom={css`
                opacity: 1;
              `}
              leaveTo={css`
                opacity: 0;
              `}
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter={css`
                transition-duration: 300ms;
                transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
              `}
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave={css`
                transition-duration: 200ms;
                transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
              `}
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {children}
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
