import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type FC } from "react";
import { classNames } from "uploadthing/client";
import OrderModal from "~/components/OrderModal/OrderModal";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import { DBProductType } from "~/types/product.schema";
import ImageLoader from "~/utils/ImageLoader";
import getTitleImage from "~/utils/getTitleImage";

interface CardProps {
  product: DBProductType;
}

const Card: FC<CardProps> = ({ product }) => {
  // const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Link
        href={{
          pathname: `/product/${product.id}`,
          // query: { group: data?.groups[0], isplayoffmode: tournament.isPlayoffs },
        }}
        className="w-full rounded-lg border bg-white shadow-sm"
      >
        <Image
          priority
          width={300}
          height={300}
          alt="dish-rental"
          loader={ImageLoader}
          className={classNames("overflow-hidden rounded-lg p-1")}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
          }}
          src={
            getTitleImage(product.images, product.titleImage)?.url ??
            "/images/placeholder.jpeg"
          }
        />
        <div className="px-2.5 py-1.5 md:px-5 md:py-2.5">
          <div className="text-left">
            <h5 className="text-base font-semibold tracking-tight text-gray-500">
              {product.name}
            </h5>
          </div>
          <div className="mt-2.5 flex items-center justify-between transition-all">
            <span className="text-3xl font-bold text-gray-900">
              {product.price} € / dienā
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const isModalOpen = router.query.order_modal === "true";
                router.push(
                  {
                    query: {
                      order_modal: !isModalOpen,
                      product_id: product.id,
                    },
                  },
                  undefined,
                  { shallow: true },
                );
              }}
              className="flex items-center justify-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
            >
              <ShoppingCartIcon />
              Pievienot grozam
            </button>
          </div>
        </div>
      </Link>
      <OrderModal
        isOrderModalOpen={router.query.order_modal === "true"}
        setIsOrderModalOpen={() => {
          // const isModalOpen = router.query.order_modal === "true";

          router.push(
            {
              query: {
                // order_modal: !isModalOpen,
                // product: product.id,
              },
            },
            undefined,
            { shallow: true },
          );
        }}
      />
    </>
  );
};

export default Card;
