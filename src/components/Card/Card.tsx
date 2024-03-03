import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { IoArrowForwardOutline } from "react-icons/io5";
import { classNames } from "uploadthing/client";
import { DBProductType } from "~/types/product.schema";
import ImageLoader from "~/utils/ImageLoader";
import getTitleImage from "~/utils/getTitleImage";

interface CardProps {
  product: DBProductType;
}

const Card: FC<CardProps> = ({ product }) => {
  return (
    <>
      <Link
        href={{
          pathname: `/product/${product.id}`,
          // query: { group: data?.groups[0], isplayoffmode: tournament.isPlayoffs },
        }}
        className="w-full rounded-lg border bg-white shadow-sm"
      >
        <div className="p-1.5">
          <Image
            priority
            width={400}
            height={400}
            alt="dish-rental"
            loader={ImageLoader}
            className={classNames("overflow-hidden rounded")}
            style={{
              height: "300px",
              objectFit: "cover",
            }}
            src={
              getTitleImage(product.images, product.titleImage)?.url ??
              "/images/placeholder.jpeg"
            }
          />
        </div>
        <div className="px-2 py-1.5 md:py-2.5">
          <div className="text-left">
            <h5 className="text-sm font-medium tracking-tight text-gray-500">
              {product.name}
            </h5>
          </div>
          <div className="mt-2 flex items-center justify-between transition-all">
            <span className="text-xl font-medium text-gray-900">
              {product.price} € / dienā
            </span>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-md bg-gray-900 px-3 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
            >
              Uzzināt vairāk
              <IoArrowForwardOutline className="text-xl" />
            </button>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Card;
