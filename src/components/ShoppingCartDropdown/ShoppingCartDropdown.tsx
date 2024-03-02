import { LOCAL_STORAGE_KEYS } from "hardcoded";
import { useState } from "react";
import Dropdown from "~/components/Dropdown/Dropdown";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";
import useLocalStorage from "~/hooks/useLocalStorage";
import { type OrderType } from "~/types/order.schema";

const ShoppingCartDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [orders, setOrders] = useLocalStorage<OrderType[]>(
    LOCAL_STORAGE_KEYS.shoppingCart,
    [],
  );

  return (
    <>
      <Dropdown
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        title={
          <div className="relative">
            <ShoppingCartIcon size="lg" />
            {orders.length > 0 && (
              <div className="absolute right-0 top-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {orders.length}
              </div>
            )}
          </div>
        }
      >
        {orders.length === 0 ? (
          <p className="px-4 py-2 text-sm text-gray-700">Jūsu grozs ir tukšs</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between px-4 py-2 text-sm text-gray-700"
            >
              <p>{order.name}</p>
              <p>{order.price} €</p>
            </div>
          ))
        )}
      </Dropdown>
    </>
  );
};

export default ShoppingCartDropdown;
