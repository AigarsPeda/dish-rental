import { useRouter } from "next/router";
import { useEffect, useState, type FC } from "react";
import Modal from "~/components/Modal/Modal";
import { api } from "../../utils/api";
import Image from "next/image";
import ImageLoader from "../../utils/ImageLoader";
import getTitleImage from "../../utils/getTitleImage";
import formatDate from "../../utils/formatDate";
import NumberInput from "../NumberInput/NumberInput";
import ShoppingCartIcon from "../icons/ShoppingCartIcon/ShoppingCartIcon";

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
        <h2 className="mt-4 text-xl font-semibold leading-7 text-gray-900">
          {data?.name}
        </h2>
        <div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">
              Pieejamas{" "}
              <span className="font-semibold text-gray-800">
                {" "}
                {data?.availablePieces}{" "}
              </span>{" "}
              vienības
            </p>
          </div>
          <div className="mt-1">
            <p className="text-sm text-gray-400">
              Piejami no{" "}
              <span className="font-semibold text-gray-800">
                {formatDate(data?.availableDatesStart)}
              </span>{" "}
              līdz{" "}
              <span className="font-semibold text-gray-800">
                {formatDate(data?.availableDatesEnd)}
              </span>
            </p>
          </div>
          <div className="mt-5 items-end justify-between gap-2 xl:flex">
            <div className="mb-4 flex items-end xl:mb-0">
              <h1 className="m-0 p-0 text-5xl font-bold">{data?.price}</h1>
              <span className="ml-2 text-base text-gray-400">€ / dienā</span>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <label
                  htmlFor="product-price"
                  className="text-sm text-gray-400"
                >
                  Skaits
                </label>
                <div className="w-40">
                  <NumberInput
                    value={0}
                    bgColor="gray"
                    id="product-price"
                    onChange={() => {
                      console.log("changed");
                    }}
                  />
                </div>
              </div>
              <button
                onClick={() => router.back()}
                className="flex h-11 items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-gray-50"
              >
                <ShoppingCartIcon size="sm" />
                Ielikt grozā
              </button>
            </div>
          </div>
        </div>

        {/* <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={() => {
              console.log("clicked");
            }}
            className="rounded-md bg-gray-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Hey
          </button>
        </div> */}
      </div>
    </Modal>
  );
};

export default OrderModal;
