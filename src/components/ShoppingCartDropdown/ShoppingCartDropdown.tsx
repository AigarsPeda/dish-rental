import Image from "next/image";
import { useContext, useState } from "react";
import Dropdown from "~/components/Dropdown/Dropdown";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import { GlobalAppContext } from "~/context/GlobalAppContext/GlobalAppContext";
import ImageLoader from "~/utils/ImageLoader";
import { formatDate } from "~/utils/dateUtils";

const ShoppingCartDropdown = () => {
  const { appState, dispatch } = useContext(GlobalAppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <Dropdown
        width="w-96"
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        title={
          <div className="relative">
            <ShoppingCartIcon size="lg" />
            {appState?.orders?.length > 0 && (
              <div className="absolute right-0 top-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {appState.orders?.length}
              </div>
            )}
          </div>
        }
      >
        {appState?.orders?.length === 0 ? (
          <p className="px-2 py-2 text-sm text-gray-700">Jūsu grozs ir tukšs</p>
        ) : (
          appState?.orders?.map((order) => (
            <div
              key={order.orderId}
              className="px-3 py-2 text-sm text-gray-700"
            >
              <div className="flex justify-between space-x-2">
                <div>
                  <Image
                    width={100}
                    height={100}
                    loader={ImageLoader}
                    alt={order.name ?? "Image"}
                    className="h-24 w-auto rounded object-cover shadow-lg"
                    src={order.imageURL ?? "/images/placeholder.jpeg"}
                  />
                </div>
                <div className="flex w-full flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h2>
                        <a href="#">Throwback Hip Bag</a>
                      </h2>
                      <p className="ml-2 text-xl">€ {order.price}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">
                        Laiks: {formatDate(order.startDate)} -{" "}
                        {formatDate(order.endDate)}
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
      </Dropdown>
    </>
  );
};

export default ShoppingCartDropdown;
