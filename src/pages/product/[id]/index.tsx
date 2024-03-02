import { ALL_OPTIONS } from "hardcoded";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import NumberInput from "~/components/NumberInput/NumberInput";
import PageHead from "~/components/PageHead/PageHead";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";
import { formatDate } from "~/utils/dateUtils";
import getTitleImage from "~/utils/getTitleImage";

export type FormStateType = {
  price: number;
  amount: number;
  orderDates: DateValueType;
};

const PostPage: NextPage = () => {
  const router = useRouter();
  const [postId, setPostId] = useState<number | null>(null);
  const { data, isLoading } = api.product.getById.useQuery(
    { id: postId ?? 1 },
    { enabled: postId !== null },
  );

  const [formsSate, setFormsState] = useState<FormStateType>({
    price: 0,
    amount: 4,
    orderDates: {
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      startDate: new Date(),
    },
  });

  useEffect(() => {
    if (router.query.id && typeof router.query.id === "string") {
      const id = parseInt(router.query.id, 10);
      setPostId(id);
    }
  }, [router.query.id]);

  const calculateDaysBetween = (startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate?.getTime() - startDate?.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculatePrice = (
    price: number | undefined,
    amount: number,
    startDate: Date,
    endDate: Date,
  ) => {
    if (!price) return 0;

    const diffDays = calculateDaysBetween(startDate, endDate);

    // round to 2 decimal places
    return Math.round(price * amount * diffDays * 100) / 100;
  };

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
  }, [data]);

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
                <div className="flex flex-row gap-4 md:flex-col">
                  {data?.images.map((image) => (
                    <Image
                      width={100}
                      height={100}
                      key={image.id}
                      src={image.url}
                      alt={image.name}
                      loader={ImageLoader}
                      className="h-24 w-24 rounded-lg object-cover shadow-lg"
                    />
                  ))}
                </div>
                <div>
                  <Image
                    width={500}
                    height={500}
                    loader={ImageLoader}
                    alt={data?.images[0]?.name ?? "Image"}
                    className="h-full max-h-[28rem] w-[28rem] rounded-lg object-cover shadow-lg"
                    src={
                      getTitleImage(data?.images, data?.titleImage)?.url ??
                      "/images/placeholder.jpeg"
                    }
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
                    onClick={() => router.back()}
                    className="flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-gray-50"
                  >
                    <ShoppingCartIcon size="sm" />
                    Ielikt grozā
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
