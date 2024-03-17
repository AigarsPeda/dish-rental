import { useAutoAnimate } from "@formkit/auto-animate/react";
import { motion, type Variants } from "framer-motion";
import { ALL_OPTIONS } from "hardcoded";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker";
import NumberInput from "~/components/NumberInput/NumberInput";
import PageHead from "~/components/PageHead/PageHead";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import { GlobalAppContext } from "~/context/GlobalAppContext/GlobalAppContext";
import { type OrderType } from "~/types/order.schema";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";
import classNames from "~/utils/classNames";
import { formatDate } from "~/utils/dateUtils";
import getTitleImage from "~/utils/getTitleImage";

const variants: Variants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: "-100%", position: "absolute" },
};

export type FormStateType = {
  price: number;
  amount: number;
  orderDates: DateValueType;
};

const PostPage: NextPage = () => {
  const router = useRouter();
  const [parent] = useAutoAnimate();
  const { dispatch } = useContext(GlobalAppContext);

  const [isAddedToOrder, setIsAddedToOrder] = useState(false);
  const { data, isLoading } = api.product.getById.useQuery(
    { id: router.query.id as string },
    { enabled: Boolean(router.query.id) },
  );

  const [formsSate, setFormsState] = useState<FormStateType>({
    price: 0,
    amount: 4,
    orderDates: {
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      startDate: new Date(),
    },
  });

  const calculateDaysBetween = (startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate?.getTime() - startDate?.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculatePrice = useCallback(
    (
      price: number | undefined,
      amount: number,
      startDate: Date,
      endDate: Date,
    ) => {
      if (!price) return 0;

      const diffDays = calculateDaysBetween(startDate, endDate);

      // round to 2 decimal places
      return Math.round(price * amount * diffDays * 100) / 100;
    },
    [],
  );

  // calculate initial price
  useEffect(() => {
    if (data) {
      const amount = formsSate.amount;
      const priceForOneDay = data.price;
      const startDate = new Date(formsSate.orderDates?.startDate ?? "");
      const endDate = new Date(formsSate.orderDates?.endDate ?? "");

      const price = calculatePrice(priceForOneDay, amount, startDate, endDate);

      setFormsState((state) => ({
        ...state,
        price: price,
      }));
    }
  }, [data, formsSate, useCallback]);

  useEffect(() => {
    // reset the added to order state after 2 seconds
    const timeout = setTimeout(() => {
      setIsAddedToOrder(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isAddedToOrder]);

  return (
    <>
      <PageHead
        title={data?.name ?? "Trauku noma | Izveidot jaunu sludinājumu"}
        descriptionLong={data?.description ?? "Nomā vai iznomā traukus"}
        descriptionShort={data?.description ?? "Nomā vai iznomā traukus"}
        image={
          getTitleImage(data?.images, data?.titleImage)?.url ??
          "/images/placeholder.jpeg"
        }
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        {isLoading && (
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Lādējās...
          </h1>
        )}
        {!isLoading && (
          <div className="flex justify-center">
            <div className="p-4 md:flex">
              <div className="flex flex-col-reverse gap-4 md:flex-row">
                <div className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-[1.35rem]">
                  {data?.images.map((image) => (
                    <div key={image.id} className="h-24 w-24 overflow-hidden">
                      <Image
                        priority
                        width={100}
                        height={100}
                        src={image.url}
                        alt="dish-rental"
                        loader={ImageLoader}
                        className=" rounded-lg shadow-lg"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="h-[22rem] w-[22rem] md:h-[28rem] md:w-[28rem]">
                  <Image
                    priority
                    width={500}
                    height={500}
                    alt="dish-rental"
                    loader={ImageLoader}
                    className="rounded-lg object-cover shadow-lg"
                    src={
                      getTitleImage(data?.images, data?.titleImage)?.url ??
                      "/images/placeholder.jpeg"
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div className="flex max-w-sm flex-col justify-between pt-5 md:pl-10 md:pt-0">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {data?.name}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data?.categories?.map((category) => (
                      <Link
                        key={category}
                        href={{
                          pathname: `/`,
                          query: { category: category },
                        }}
                        className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-800 md:px-6 md:py-2"
                      >
                        {ALL_OPTIONS[category as keyof typeof ALL_OPTIONS]}
                      </Link>
                    ))}
                  </div>

                  <div className="pt-8">
                    <p className="text-gray-700">{data?.description}</p>
                  </div>
                </div>

                <div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-800">
                      Pieejamas {data?.availablePieces} vienības
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-800">
                      No {formatDate(data?.availableDatesStart)} līdz{" "}
                      {formatDate(data?.availableDatesEnd)}
                    </p>
                  </div>
                  <div className="my-3 flex items-end xl:mb-0">
                    <p className="m-0 p-0 text-xl font-medium">
                      € {data?.price}
                    </p>
                    <p className="ml-2 pb-px text-sm text-gray-600">dienā</p>
                  </div>
                  <div className="mt-2 items-end justify-between gap-2 xl:flex">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <label
                          htmlFor="product-price"
                          className="text-sm text-gray-400"
                        >
                          Skaits
                        </label>
                        <div className="md:w-32">
                          <NumberInput
                            id="product-price"
                            value={formsSate.amount}
                            onChange={(num) => {
                              const price = calculatePrice(
                                data?.price,
                                num,
                                new Date(formsSate.orderDates?.startDate ?? ""),
                                new Date(formsSate.orderDates?.endDate ?? ""),
                              );

                              setFormsState({
                                ...formsSate,
                                amount: num,
                                price: price,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="product-price"
                          className="text-sm text-gray-400"
                        >
                          Laiks
                        </label>
                        <Datepicker
                          toggleClassName="hidden"
                          displayFormat={"DD/MM/YYYY"}
                          inputClassName="rounded-md bg-white placeholder:text-gray-500 focus:ring-0 w-[12rem] font-semibold text-sm h-11 text-gray-800 text-center"
                          value={formsSate.orderDates}
                          onChange={(newValue) => {
                            const price = calculatePrice(
                              data?.price,
                              formsSate.amount,
                              new Date(newValue?.startDate ?? ""),
                              new Date(newValue?.endDate ?? ""),
                            );

                            setFormsState({
                              ...formsSate,
                              price: price,
                              orderDates: newValue,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex w-full justify-end md:mt-3">
                  <button
                    ref={parent}
                    onClick={() => {
                      if (data) {
                        const order: OrderType = {
                          orderId: crypto.randomUUID(),
                          productId: data.id ?? 0,
                          name: data.name ?? "",
                          price: formsSate.price,
                          quantity: formsSate.amount,
                          startDate: new Date(
                            formsSate.orderDates?.startDate ?? "",
                          ),
                          endDate: new Date(
                            formsSate.orderDates?.endDate ?? "",
                          ),
                          imageURL:
                            getTitleImage(data.images, data.titleImage)?.url ??
                            "",
                        };

                        dispatch({
                          type: "ADD_ORDER_ITEM",
                          payload: order,
                        });
                        setIsAddedToOrder(true);
                      }
                    }}
                    className={classNames(
                      "relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-gray-50 transition-all",
                    )}
                  >
                    <motion.div
                      variants={variants}
                      initial="closed"
                      animate={!isAddedToOrder ? "open" : "closed"}
                      className="absolute flex h-full w-full items-center justify-center gap-2 rounded-md bg-gray-800"
                    >
                      <ShoppingCartIcon size="sm" />
                      Ielikt grozā
                    </motion.div>

                    <motion.div
                      variants={variants}
                      initial="closed"
                      animate={isAddedToOrder ? "open" : "closed"}
                      className="absolute flex h-full w-full items-center justify-center gap-2 rounded-md bg-green-500"
                    >
                      <IoCheckmarkSharp className="h-6 w-6" />
                      <span>Pievienots</span>
                    </motion.div>
                  </button>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-ms mt-2 text-gray-400">
                      € {data?.price} x {formsSate.amount} x{" "}
                      {calculateDaysBetween(
                        new Date(formsSate.orderDates?.startDate ?? ""),
                        new Date(formsSate.orderDates?.endDate ?? ""),
                      )}{" "}
                      dienas
                    </p>
                  </div>
                  <div className="text-right ">
                    <p>
                      <span className=" text-gray-400">Kopā: </span>
                      <span className="text-2xl font-medium text-gray-900">
                        € {formsSate.price}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default PostPage;
