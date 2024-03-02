import { useState } from "react";
import Dropdown from "~/components/Dropdown/Dropdown";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";

const ShoppingCartDropdown = () => {
  const [orders, setOrders] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <Dropdown
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        title={<ShoppingCartIcon size="lg" />}
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
