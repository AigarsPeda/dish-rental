import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import ProfileDropdown from "~/components/ProfileDropdown/ProfileDropdown";
import ShoppingCartDropdown from "~/components/ShoppingCartDropdown/ShoppingCartDropdown";

const NavBar: FC = () => {
  return (
    <div className="flex items-center justify-between bg-gray-100 px-4 py-2 shadow-sm">
      <Link href="/" className="flex items-center gap-4">
        <Image
          width={50}
          height={50}
          alt="dish-rental"
          className="rounded-full"
          src="/images/placeholder.jpeg"
        />
        <p className="text-3xl font-extrabold tracking-tight text-gray-800">
          Dish rental
        </p>
      </Link>
      <div className="flex items-end text-gray-800">
        <ProfileDropdown />
        <ShoppingCartDropdown />
      </div>
    </div>
  );
};

export default NavBar;
