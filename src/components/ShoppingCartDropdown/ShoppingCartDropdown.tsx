import { useContext, useState } from "react";
import Dropdown from "~/components/Dropdown/Dropdown";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import { GlobalAppContext } from "~/context/GlobalAppContext/GlobalAppContext";

const ShoppingCartDropdown = () => {
  const { appState } = useContext(GlobalAppContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [orders, setOrders] = useLocalStorage<OrderType[]>(
  //   LOCAL_STORAGE_KEYS.shoppingCart,
  //   [],
  // );

  return (
    <>
      <Dropdown
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        title={
          <div className="relative">
            <ShoppingCartIcon size="lg" />
            {appState.orders.length > 0 && (
              <div className="absolute right-0 top-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {appState.orders.length}
              </div>
            )}
          </div>
        }
      >
        {appState.orders.length === 0 ? (
          <p className="px-4 py-2 text-sm text-gray-700">Jūsu grozs ir tukšs</p>
        ) : (
          appState.orders.map((order) => (
            <div
              key={order.order_id}
              className="flex items-center justify-between px-4 py-2 text-sm text-gray-700"
            >
              <div>
                <p>{order.start_date.toISOString()}</p>
                <p>{order.end_date.toISOString()}</p>
              </div>
              <div>
                <p>{order.name}</p>
                <p>{order.price} €</p>
                <p>
                  {order.quantity} x {order.price} € ={" "}
                  {order.quantity * order.price} €
                </p>
              </div>
            </div>
          ))
        )}
      </Dropdown>
    </>
  );
};

export default ShoppingCartDropdown;
