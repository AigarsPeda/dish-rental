import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LuMail } from "react-icons/lu";
import { type DateValueType } from "react-tailwindcss-datepicker";
import { z } from "zod";
import PageHead from "~/components/PageHead/PageHead";
import TextInput from "~/components/TextInput/TextInput";
import { OrderSchema, type OrderFormType } from "~/types/order.schema";
import ImageLoader from "~/utils/ImageLoader";
import { api } from "~/utils/api";
import { formatDate } from "~/utils/dateUtils";
import getSumOfOrders from "~/utils/getSumOfOrders";

export type FormStateType = {
  selectedCategories: string[];
  availableDates: DateValueType;
};

const UrlSchema = z.array(OrderSchema);

const Home: NextPage = () => {
  const router = useRouter();
  const { mutate, isLoading } = api.product.createOrder.useMutation();

  const [orderFormState, setOrderFormState] = useState<OrderFormType>({
    orderId: "",
    orders: [],
    client: {
      name: "",
      email: "",
      phone: "",
      billingAddress: "",
      deliveryAddress: "",
    },
  });

  useEffect(() => {
    const { id, orders } = router.query;
    if (
      !orders ||
      typeof orders !== "string" ||
      !id ||
      typeof id !== "string"
    ) {
      console.error("No orders in query ????");
      return;
    }

    const validOrders = UrlSchema.parse(JSON.parse(orders));

    setOrderFormState((s) => {
      return {
        ...s,
        orderId: id,
        orders: validOrders,
      };
    });
  }, [router.query.orders]);

  return (
    <>
      <PageHead
        title="Trauku noma"
        descriptionShort="Nomā vai iznomā traukus"
        descriptionLong="Nomā vai iznomā traukus"
      />
      <main className="min-h-screen bg-gray-100 bg-gradient-to-b">
        <form
          className="px-4 py-14 2xl:container md:px-6 2xl:mx-auto 2xl:px-20"
          onSubmit={(e) => {
            e.preventDefault();
            console.log(orderFormState);
            mutate(orderFormState);
          }}
        >
          <div className="item-start flex flex-col justify-start space-y-2">
            <h1 className="text-3xl font-semibold leading-7 text-gray-800 dark:text-white lg:text-4xl lg:leading-9">
              Pasūtījums #{orderFormState.orderId}
            </h1>
            {/* <p className="text-base font-medium leading-6 text-gray-600 dark:text-gray-300">
              21st Mart 2021 at 10:34 PM
            </p> */}
          </div>
          <div className="mt-10 flex w-full flex-col items-stretch justify-center space-y-4 md:space-y-6 xl:flex-row xl:space-x-8 xl:space-y-0">
            <div className="flex w-full flex-col items-start justify-start space-y-4 md:space-y-6 xl:space-y-8">
              <div className="flex w-full flex-col items-start justify-start bg-gray-50 px-4 py-4 dark:bg-gray-800 md:p-6 md:py-6 xl:p-8">
                <p className="mb-4 text-lg font-semibold leading-6 text-gray-800 dark:text-white md:text-xl xl:leading-5">
                  Jūsu pasūtījums
                </p>

                {orderFormState.orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="flex w-full flex-col items-start justify-start md:flex-row md:items-center md:space-x-6 xl:space-x-8"
                  >
                    <div className="flex w-full justify-center pb-4 md:w-40">
                      <Image
                        priority
                        width={400}
                        height={300}
                        loader={ImageLoader}
                        alt={order.name ?? "Image"}
                        src={order.imageURL ?? "/images/placeholder.jpeg"}
                        className="h-auto max-h-52 w-full rounded object-cover shadow-lg md:max-h-32"
                      />
                    </div>
                    <div className="flex w-full flex-col items-start justify-between space-y-4 border-b border-gray-200 pb-8 md:flex-row md:space-y-0">
                      <div className="flex w-full flex-col items-start justify-start space-y-8">
                        <h3 className="text-xl font-semibold leading-6 text-gray-800 dark:text-white xl:text-2xl">
                          {order.name}
                        </h3>
                        <div className="flex flex-col items-start justify-between space-y-2">
                          <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2">
                              <p className="text-sm leading-none text-gray-400">
                                No:{" "}
                              </p>
                            </div>
                            <div className="col-span-4">
                              <p className="text-sm leading-none text-gray-800">
                                {formatDate(order.startDate)}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2">
                              <p className="text-sm leading-none text-gray-400">
                                Līdz:{" "}
                              </p>
                            </div>
                            <div className="col-span-4">
                              <p className="text-sm leading-none text-gray-800">
                                {formatDate(order.endDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full items-start justify-between space-x-8">
                        <p className="text-base leading-6 text-gray-800">
                          <span className="text-sm leading-none text-gray-400">
                            Skaits:{" "}
                          </span>{" "}
                          {order.quantity}
                        </p>
                        <p className="text-base font-semibold leading-6 text-gray-800 dark:text-white xl:text-lg">
                          <span className="text-sm leading-none text-gray-400">
                            Cena:{" "}
                          </span>{" "}
                          € {order.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex w-full flex-col items-center justify-between bg-gray-50 px-4 py-6 dark:bg-gray-800 md:items-start md:p-6 xl:w-96 xl:p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                    Klients
                  </h3>
                </div>
                <div className="flex h-full w-full flex-col items-stretch justify-start md:flex-row md:space-x-6 lg:space-x-8 xl:flex-col xl:space-x-0">
                  <div className="flex min-w-72 flex-shrink-0 flex-col items-start justify-start">
                    <div className="flex w-full items-center justify-center space-x-4 border-b border-gray-200 pb-6 md:justify-start">
                      <div className="flex w-full flex-col items-start justify-start space-y-0">
                        <TextInput
                          isRequired
                          name="Vārds"
                          labelSize="small"
                          value={orderFormState.client?.name}
                          onChange={(e) =>
                            setOrderFormState({
                              ...orderFormState,
                              client: { ...orderFormState.client, name: e },
                            })
                          }
                        />

                        <div className="w-full pt-3">
                          <TextInput
                            isRequired
                            type="tel"
                            name="Telefons"
                            labelSize="small"
                            value={orderFormState.client?.phone}
                            onChange={(e) =>
                              setOrderFormState({
                                ...orderFormState,
                                client: { ...orderFormState.client, phone: e },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-center space-x-2 border-b border-gray-200 py-4 text-gray-800 dark:text-white md:justify-start">
                      <LuMail className="h-7 w-7" />
                      <TextInput
                        name=""
                        isRequired
                        type="email"
                        labelSize="small"
                        value={orderFormState.client?.email}
                        onChange={(e) =>
                          setOrderFormState({
                            ...orderFormState,
                            client: { ...orderFormState.client, email: e },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex w-full flex-col items-stretch justify-between md:mt-0 xl:h-full">
                    <div className="flex w-full flex-col items-center justify-center space-y-4 md:flex-row md:items-start md:justify-start md:space-x-6 md:space-y-0 lg:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-12">
                      <div className="flex w-full flex-col items-center justify-center space-y-0 md:items-start md:justify-start xl:mt-8">
                        <TextInput
                          isRequired
                          labelSize="small"
                          name="Piegādes Adrese"
                          value={orderFormState.client?.deliveryAddress}
                          onChange={(e) =>
                            setOrderFormState({
                              ...orderFormState,
                              client: {
                                ...orderFormState.client,
                                deliveryAddress: e,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="flex w-full flex-col items-center justify-center space-y-0 md:items-start md:justify-start">
                        <TextInput
                          isRequired
                          labelSize="small"
                          name="Rēķina Adrese"
                          value={orderFormState.client?.billingAddress}
                          onChange={(e) =>
                            setOrderFormState({
                              ...orderFormState,
                              client: {
                                ...orderFormState.client,
                                billingAddress: e,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    {/* <div className="flex w-full items-center justify-center md:items-start md:justify-start">
                      <button className="mt-6 w-96 border border-gray-800 py-5 text-base font-medium leading-4 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 dark:border-white dark:bg-transparent dark:text-white dark:hover:bg-gray-900 md:mt-0 2xl:w-full">
                        Edit Details
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col items-stretch justify-end space-y-4 md:flex-row md:space-x-6 md:space-y-0 xl:space-x-8">
                <div className="flex w-full flex-col space-y-6 bg-gray-50 px-4 py-6 dark:bg-gray-800 md:max-w-[50%] md:p-6 xl:p-8">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                    Kopsavilkums
                  </h3>
                  <div className="flex w-full flex-col items-center justify-center space-y-4 border-b border-gray-200 pb-4">
                    <div className="flex w-full justify-between">
                      <p className="text-base leading-4 text-gray-800 dark:text-white">
                        Apakšsumma
                      </p>
                      <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                        € {getSumOfOrders(orderFormState.orders)}
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <p className="text-base leading-4 text-gray-800 dark:text-white">
                        Piegāde
                      </p>
                      <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                        € 8.00
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <p className="text-base font-semibold leading-4 text-gray-800 dark:text-white">
                      Kopā
                    </p>
                    <p className="text-base font-semibold leading-4 text-gray-600 dark:text-gray-300">
                      € {getSumOfOrders(orderFormState.orders) + 8.0}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <button
                      type="submit"
                      className="w-96 bg-gray-800 py-5 text-base font-medium leading-4 text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 md:w-full"
                    >
                      Pasūtīt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default Home;
