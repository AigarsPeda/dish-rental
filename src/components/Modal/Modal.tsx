import { useRef, type FC, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import useDelayUnmount from "~/hooks/useDelayUnmount";
import useOnClickOutside from "~/hooks/useOnClickOutside";
import classNames from "~/utils/classNames";

interface ModalProps {
  title?: string;
  children: ReactNode;
  isModalOpen: boolean;
  handleModalClose: () => void;
}

const Modal: FC<ModalProps> = ({
  title,
  children,
  isModalOpen,
  handleModalClose,
}) => {
  const ref = useRef(null);
  const { shouldRender, isAnimation } = useDelayUnmount(isModalOpen, 100);

  useOnClickOutside(ref, () => {
    if (isModalOpen) {
      handleModalClose();
    }
  });

  return (
    <>
      {shouldRender && (
        <>
          <div className="fixed bottom-0 left-0 right-0 top-0 z-[141] flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="pointer-events-none fixed bottom-0 left-0 right-0 top-[-4rem] z-[100] bg-black opacity-25"></div>
            <div
              ref={ref}
              className="absolute z-[1000] mx-auto my-6 w-auto max-w-3xl px-2"
            >
              <div
                className={classNames(
                  isAnimation
                    ? "visible translate-x-0 scale-100 opacity-100"
                    : "invisible scale-95 opacity-0",
                  "relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none transition-all focus:outline-none",
                )}
              >
                <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-2">
                  <h3 className="text-3xl font-semibold">{title ?? ""}</h3>
                  <button
                    type="button"
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none outline-none focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleModalClose();
                    }}
                  >
                    <IoClose className="text-gray-200" />
                  </button>
                </div>
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
