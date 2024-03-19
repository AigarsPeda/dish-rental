import Image from "next/image";
import { useState, type FC, use, useEffect } from "react";
import Modal from "~/components/Modal/Modal";
import { type ImageToDeleteType } from "~/pages/product/[id]/edit";
import ImageLoader from "~/utils/ImageLoader";

interface DeleteImageModalProps {
  isDeleting: boolean;
  imageToDelete: ImageToDeleteType;
  handleModalClose: () => void;
  handleImageDelete: () => void;
}

const DeleteImageModal: FC<DeleteImageModalProps> = ({
  isDeleting,
  imageToDelete,
  handleImageDelete,
  handleModalClose,
}) => {
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (!imageToDelete?.imgSrc) return;

    setImgSrc(imageToDelete?.imgSrc);
  }, [imageToDelete]);

  return (
    <Modal
      handleModalClose={handleModalClose}
      isModalOpen={Boolean(imageToDelete?.imgSrc)}
    >
      <div className="w-full border-b border-gray-900/10 p-6 pb-6 pt-4">
        <div className="text-left">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Vai tiešām vēlaties dzēst šo attēlu?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Attēls tiks neatgriezeniski dzēsts.
          </p>
        </div>
        <div className="mt-4 flex h-[300px] w-full items-center justify-center overflow-hidden rounded-md bg-fuchsia-400">
          <Image
            priority
            width={0}
            height={0}
            loader={ImageLoader}
            alt="Attēls ko vēlaties dzēst"
            src={imgSrc ?? "/images/placeholder.jpeg"}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="mt-3 flex items-center justify-end gap-x-2">
          <button
            onClick={handleImageDelete}
            className="rounded-md bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            {isDeleting ? "Dzēšu..." : "Dzēst"}
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
