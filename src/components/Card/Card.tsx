import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";

const Card: FC = () => {
  return (
    <Link
      href={{
        pathname: `/post/${1}`,
        // query: { group: data?.groups[0], isplayoffmode: tournament.isPlayoffs },
      }}
      className="w-full rounded-lg border bg-white shadow-sm"
    >
      <Image
        alt="dish-rental"
        src="/images/Ceramic.jpg"
        className="overflow-hidden rounded-lg p-1"
        width={300}
        height={300}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
        }}
      />

      <div className="px-2.5 py-1.5 md:px-5 md:py-2.5">
        <div className="text-left">
          <h5 className="text-base font-semibold tracking-tight text-gray-500">
            Šķīvis ø 13cm
          </h5>
        </div>
        {/* <div className="mb-5 mt-2.5 flex items-center">
          <Stars />
          <span className="ms-3 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
            5.0
          </span>
        </div> */}
        <div className="mt-2.5 flex items-center justify-between transition-all">
          <span className="text-4xl font-bold text-gray-900">€ 20</span>
          <button
            onClick={() => console.log("clicked")}
            className="flex items-center justify-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
          >
            <ShoppingCartIcon />
            Pievienot grozam
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Card;
