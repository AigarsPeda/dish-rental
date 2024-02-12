import { type FC } from "react";
import { classNames } from "uploadthing/client";

interface ShoppingCartIconProps {
  size?: "sm" | "md" | "lg";
}

const ShoppingCartIcon: FC<ShoppingCartIconProps> = ({ size = "sm" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(
        size === "sm" && "h-5 w-5",
        size === "md" && "h-6 w-6",
        size === "lg" && "h-7 w-7",
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
};

export default ShoppingCartIcon;
