import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import ProfileDropdown from "~/components/ProfileDropdown/ProfileDropdown";
import ShoppingCartIcon from "~/components/icons/ShoppingCartIcon/ShoppingCartIcon";

const NavBar: FC = () => {
  return (
    <div className="flex items-center justify-between bg-gray-100 px-4 py-2 shadow-sm">
      <Link href="/" className="flex items-center gap-4">
        <Image
          width={50}
          height={50}
          alt="dish-rental"
          className="rounded-full"
          src="/images/dish_rent.png"
        />
        <p className="text-3xl font-extrabold tracking-tight text-gray-800">
          Dish rental
        </p>
      </Link>
      <div className="flex items-center gap-2 text-gray-800">
        <ShoppingCartIcon size="lg" />
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default NavBar;
