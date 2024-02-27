import { useRouter } from "next/router";
import { useEffect, useState, type FC } from "react";
import Modal from "~/components/Modal/Modal";
import { api } from "../../utils/api";
import Image from "next/image";
import ImageLoader from "../../utils/ImageLoader";
import getTitleImage from "../../utils/getTitleImage";

interface OrderModalProps {
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (value: boolean) => void;
}

const OrderModal: FC<OrderModalProps> = ({
  isOrderModalOpen,
  setIsOrderModalOpen,
}) => {
  const router = useRouter();
  const [postId, setPostId] = useState<number | null>(null);
  const { data, isLoading } = api.product.getById.useQuery(
    { id: postId ?? 1 },
    { enabled: postId !== null },
  );

  useEffect(() => {
    if (
      router.query.product_id &&
      typeof router.query.product_id === "string"
    ) {
      const id = parseInt(router.query.product_id, 10);
      setPostId(id);
    }
  }, [router.query]);

  return (
    <Modal
      isModalOpen={isOrderModalOpen}
      handleModalClose={() => {
        setIsOrderModalOpen(false);
      }}
    >
      <div className="w-full border-b border-gray-900/10 p-3">
        <div>
          <Image
            width={200}
            height={200}
            loader={ImageLoader}
            alt={data?.images[0]?.name ?? "Image"}
            className="h-full max-h-[20rem] w-[24rem] rounded-lg object-cover"
            src={
              getTitleImage(data?.images, data?.titleImage)?.url ??
              "/images/placeholder.jpeg"
            }
          />
        </div>
        <h2 className="text-xl font-semibold leading-7 text-gray-900">
          Pie šī vēl strādājam
        </h2>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={() => {
              console.log("clicked");
            }}
            className="rounded-md bg-gray-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Hey
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;
