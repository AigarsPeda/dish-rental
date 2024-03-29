import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, type FC } from "react";
import Dropdown from "~/components/Dropdown/Dropdown";
import ProfileAvatar from "~/components/ProfileDropdown/ProfileAvatar";
import classNames from "~/utils/classNames";

const ProfileDropdown: FC = () => {
  const { data: sessionData } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <Dropdown
        isDisableArrow
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        title={
          sessionData ? (
            <ProfileAvatar
              src={sessionData.user?.image}
              name={sessionData.user?.name ?? "n/a"}
            />
          ) : (
            <p>Ielogoties</p>
          )
        }
      >
        <Link
          tabIndex={-1}
          role="menuitem"
          id="menu-item-0"
          href="/new-product"
          onClick={() => setIsDropdownOpen(false)}
          className="block px-4 py-2 text-sm text-gray-700"
        >
          Jauns sludinājums
        </Link>
        {sessionData && (
          <Link
            tabIndex={-1}
            role="menuitem"
            id="menu-item-0"
            href="/my-products"
            onClick={() => setIsDropdownOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700"
          >
            Mani sludinājumi
          </Link>
        )}

        <button
          tabIndex={-1}
          role="menuitem"
          id="menu-item-3"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
          className={classNames(
            !sessionData ? "font-semibold" : "font-normal",
            "block w-full px-4 py-2 text-left text-sm text-gray-700",
          )}
        >
          {sessionData ? "Izlogoties" : "Ielogoties"}
        </button>
      </Dropdown>
    </>
  );
};

export default ProfileDropdown;
