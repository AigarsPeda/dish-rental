import { type FC } from "react";
import Modal from "~/components/Modal/Modal";
import Image from "next/image";
import ImageLoader from "~/utils/ImageLoader";

interface DeleteImageModalProps {
  imgSrc: string | undefined;
  handleModalClose: () => void;
  handleImageDelete: () => void;
}

const DeleteImageModal: FC<DeleteImageModalProps> = ({
  imgSrc,
  handleImageDelete,
  handleModalClose,
}) => {
  return (
    <Modal isModalOpen={Boolean(imgSrc)} handleModalClose={handleModalClose}>
      <div className="w-full border-b border-gray-900/10 p-6 pb-6 pt-4">
        <h2 className="text-xl font-semibold leading-7 text-gray-900">
          Vai tiešām vēlaties dzēst šo attēlu?
        </h2>
        <div className="mt-4 flex w-full items-center justify-center bg-fuchsia-400">
          {imgSrc && (
            <Image
              priority
              width={0}
              height={0}
              src={imgSrc ?? ""}
              loader={ImageLoader}
              alt="Attēls ko vēlaties dzēst"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
              }}
            />
          )}
        </div>
        <div className="mt-5 flex items-center justify-end gap-x-2">
          <button
            onClick={() => {
              handleImageDelete();
              handleModalClose();
            }}
            className="rounded-md bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Dzēst
          </button>
          <button
            onClick={handleModalClose}
            className="rounded-md bg-gray-800 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Atcelt
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteImageModal;
