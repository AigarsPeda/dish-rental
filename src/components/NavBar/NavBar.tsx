import Image from "next/image";
import { type FC } from "react";
import ProfileDropdown from "~/components/ProfileDropdown/ProfileDropdown";
import Link from "next/link";
import ShoppingCartIcon from "../icons/ShoppingCartIcon/ShoppingCartIcon";

const NavBar: FC = () => {
  return (
    <div className="flex items-center justify-between bg-gray-800 px-4 py-2 shadow-sm">
      <Link href="/" className="flex items-center gap-4">
        <Image
          src="/images/dish_rent.png"
          alt="dish-rental"
          className="rounded-full"
          width={50}
          height={50}
        />
        <p className="text-3xl font-extrabold tracking-tight text-gray-50">
          Dish rental
        </p>
      </Link>
      <div className="flex items-center text-white">
        <ShoppingCartIcon size="md" />
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default NavBar;
