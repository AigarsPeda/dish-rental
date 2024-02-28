import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, type FC } from "react";
import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker";
import Modal from "~/components/Modal/Modal";
import NumberInput from "~/components/NumberInput/NumberInput";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";
import formatDate from "~/utils/formatDate";
import getTitleImage from "~/utils/getTitleImage";

export type FormStateType = {
  availableDates: DateValueType;
};

interface OrderModalProps {
  isOrderModalOpen: boolean;
  handleModalClose: () => void;
}

const OrderModal: FC<OrderModalProps> = ({
  isOrderModalOpen,
  handleModalClose,
}) => {
  const router = useRouter();
  const [postId, setPostId] = useState<number | null>(null);
  const { data, isLoading } = api.product.getById.useQuery(
    { id: postId ?? 1 },
    { enabled: postId !== null },
  );
  const [formsSate, setFormsState] = useState<FormStateType>({
    availableDates: {
      endDate: null,
      startDate: null,
    },
  });

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
    <Modal isModalOpen={isOrderModalOpen} handleModalClose={handleModalClose}>
      <div className="w-full border-b border-gray-900/10 p-3">
        <div>
          <Image
            width={200}
            height={200}
            loader={ImageLoader}
            alt={data?.images[0]?.name ?? "Image"}
            className="h-full max-h-[20rem] w-full rounded-lg object-cover"
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
            <div className="flex flex-wrap items-end gap-3 pb-3 md:justify-between">
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
              <div>
                <Datepicker
                  toggleClassName="hidden"
                  displayFormat={"DD/MM/YYYY"}
                  inputClassName="rounded-md pl-3 bg-gray-200 placeholder:text-gray-500 focus:ring-0 md:w-64 w-[18rem] font-semibold text-sm h-11 text-gray-800 text-center"
                  value={formsSate.availableDates}
                  onChange={(newValue) => {
                    setFormsState({
                      ...formsSate,
                      availableDates: newValue,
                    });
                    void router.push({
                      pathname: "/",
                      query: {
                        ...router.query,
                        end_date: newValue?.endDate?.toString(),
                        start_date: newValue?.startDate?.toString(),
                      },
                    });
                  }}
                />
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
      </div>
    </Modal>
  );
};

export default OrderModal;
