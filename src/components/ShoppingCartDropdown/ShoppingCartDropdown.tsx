import { useAutoAnimate } from "@formkit/auto-animate/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import Dropdown from "~/components/Dropdown/Dropdown";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import { GlobalAppContext } from "~/context/GlobalAppContext/GlobalAppContext";
import { type OrderType } from "~/types/order.schema";
import ImageLoader from "~/utils/ImageLoader";
import { formatDate } from "~/utils/dateUtils";

const ShoppingCartDropdown = () => {
  const [parent] = useAutoAnimate();
  const { appState, dispatch } = useContext(GlobalAppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getSumOfOrders = (orders: OrderType[]) => {
    return orders?.reduce((acc, order) => {
      return Math.round((acc + order.price) * 100) / 100;
    }, 0);
  };

  return (
    <>
      <Dropdown
        width="w-80"
        isDisableArrow
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        title={
          <div className="relative">
            <ShoppingCartIcon size="lg" />
            {appState?.orders?.length > 0 && (
              <div className="absolute right-0 top-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-0.5 text-xs text-white">
                {appState.orders?.length}
              </div>
            )}
          </div>
        }
      >
        <div ref={parent}>
          {appState?.orders?.length === 0 ? (
            <p className="px-2 py-2 text-sm text-gray-700">
              Jūsu grozs ir tukšs
            </p>
          ) : (
            appState?.orders?.map((order) => (
              <div
                key={order.orderId}
                className="px-3 py-2 text-sm text-gray-700"
              >
                <div className="flex justify-between space-x-2">
                  <div className="h-20 w-28">
                    <Image
                      width={100}
                      height={100}
                      loader={ImageLoader}
                      alt={order.name ?? "Image"}
                      className="h-auto max-h-20 w-28 rounded object-cover shadow-lg"
                      src={order.imageURL ?? "/images/placeholder.jpeg"}
                    />
                  </div>
                  <div className="flex w-full flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h2>
                          <Link href={`/product/${order.productId}`}>
                            {order.name}
                          </Link>
                        </h2>
                        <p className="ml-2">€ {order.price}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">
                          Laiks: {formatDate(new Date(order.startDate))} -{" "}
                          {formatDate(new Date(order.endDate))}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Skaits: {order.quantity}</p>

                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_ORDER_ITEM",
                              payload: {
                                id: order.orderId,
                              },
                            })
                          }
                        >
                          Noņemt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div className="px-2">
            <div className="mx-auto my-1 h-px w-full bg-gray-200" />
            <div>
              <div className="flex justify-between px-2 py-2 text-sm text-gray-700">
                <p className="text-xl">Kopā:</p>
                <p className="text-xl">€ {getSumOfOrders(appState?.orders)}</p>
              </div>
            </div>
          </div>

          {appState?.orders?.length !== 0 && (
            <div className="mt-2 flex justify-between px-2 pb-1">
              <button
                type="button"
                className="h-8 px-2 text-sm font-medium text-gray-500 hover:text-red-500"
                onClick={() =>
                  dispatch({
                    type: "CLEAR_ORDERS",
                  })
                }
              >
                Izrīrīt grozu
              </button>
              <Link
                className="flex h-full items-center justify-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white"
                onClick={() => setIsDropdownOpen(false)}
                href={{
                  pathname: `/booking/${111}`,
                  search: `?orders=${JSON.stringify(appState.orders)}`,
                }}
              >
                Noformēt pasūtījumu
              </Link>
            </div>
          )}
        </div>
      </Dropdown>
    </>
  );
};

export default ShoppingCartDropdown;
