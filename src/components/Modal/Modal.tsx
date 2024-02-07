import { useRef, type FC, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import { classNames } from "uploadthing/client";
import useDelayUnmount from "~/hooks/useDelayUnmount";
import useOnClickOutside from "~/hooks/useOnClickOutside";

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
          <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div
              className="relative mx-auto my-6 w-auto max-w-3xl px-2"
              ref={ref}
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
                    onClick={handleModalClose}
                  >
                    <IoClose className="text-gray-200" />
                  </button>
                </div>
                {children}

                {/* <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
                    <button
                      className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                      type="button"
                      onClick={handleModalClose}
                    >
                      Close
                    </button>
                    <button
                      className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                      type="button"
                      onClick={handleSuccess}
                    >
                      Save Changes
                    </button>
                  </div> */}
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 top-[-4rem] z-40 bg-black opacity-25"></div>
        </>
      )}
    </>
  );
};

export default Modal;
