import Image from "next/image";
import { type FC } from "react";

const Card: FC = () => {
  return (
    <div className="w-full rounded-lg border bg-white shadow-sm">
      <a className="h-full w-full" href="#">
        <Image
          src="/images/dish_rent.png"
          alt="dish-rental"
          className="overflow-hidden rounded-lg p-1"
          width={300}
          height={300}
          style={{
            width: "100%",
            objectFit: "fill",
          }}
        />
      </a>
      <div className="px-2.5 py-1.5 md:px-5 md:py-2.5">
        <a href="#">
          <h5 className="text-base font-semibold tracking-tight text-gray-900">
            Šķīvis ø 13cm
          </h5>
        </a>
        {/* <div className="mb-5 mt-2.5 flex items-center">
          <Stars />
          <span className="ms-3 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
            5.0
          </span>
        </div> */}
        <div className="mt-2.5 flex items-center justify-between transition-all">
          <span className="text-2xl font-bold text-gray-900">€ 20</span>
          <a
            href="#"
            className="rounded-lg bg-blue-700 px-2.5 py-1.5 text-center text-sm font-medium text-white transition-all hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 md:px-5 md:py-2.5"
          >
            Uzzini vairāk
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
