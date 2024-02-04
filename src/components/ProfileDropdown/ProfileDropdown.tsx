import { signIn, signOut, useSession } from "next-auth/react";
import { type FC } from "react";
import Dropdown from "~/components/Dropdown/Dropdown";

const ProfileDropdown: FC = () => {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return (
      <button
        className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-700"
        onClick={() => void signIn()}
      >
        Ielogoties
      </button>
    );
  }

  return (
    <>
      <Dropdown title={sessionData.user?.name ?? ""}>
        <a
          href="#"
          className="block px-4 py-2 text-sm text-gray-700"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-0"
        >
          Mans profils
        </a>
        <button
          className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-700"
          role="menuitem"
          tabIndex={-1}
          id="menu-item-3"
          onClick={() => void signOut()}
        >
          Izlogoties
        </button>
      </Dropdown>
    </>
    // <div className="flex items-center">
    //   <p className="text-center text-gray-900">
    //     {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
    //   </p>
    //   <button
    //     className="px-10 py-2 font-semibold text-gray-900 no-underline transition hover:bg-white/20"
    //     onClick={sessionData ? () => void signOut() : () => void signIn()}
    //   >
    //     {sessionData ? "Izlogoties " : "Ielogoties"}
    //   </button>
    // </div>
    // <div className="relative inline-block text-left">
    //   <div>
    //     <button
    //       type="button"
    //       className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    //       id="menu-button"
    //       aria-expanded="true"
    //       aria-haspopup="true"
    //       onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    //     >
    //       {sessionData.user?.name}

    //       <svg
    //         className="-mr-1 h-5 w-5 text-gray-400"
    //         viewBox="0 0 20 20"
    //         fill="currentColor"
    //         aria-hidden="true"
    //       >
    //         <path
    //           fill-rule="evenodd"
    //           d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
    //           clip-rule="evenodd"
    //         />
    //       </svg>
    //     </button>
    //   </div>

    //   {isDropdownOpen && (
    //     <div
    //       className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    //       role="menu"
    //       aria-orientation="vertical"
    //       aria-labelledby="menu-button"
    //       tabIndex={-1}
    //     >
    //       <div className="py-1" role="none">
    //         <a
    //           href="#"
    //           className="block px-4 py-2 text-sm text-gray-700"
    //           role="menuitem"
    //           tabIndex={-1}
    //           id="menu-item-0"
    //         >
    //           Account settings
    //         </a>
    //         <a
    //           href="#"
    //           className="block px-4 py-2 text-sm text-gray-700"
    //           role="menuitem"
    //           tabIndex={-1}
    //           id="menu-item-1"
    //         >
    //           Support
    //         </a>
    //         <a
    //           href="#"
    //           className="block px-4 py-2 text-sm text-gray-700"
    //           role="menuitem"
    //           tabIndex={-1}
    //           id="menu-item-2"
    //         >
    //           License
    //         </a>
    //         <form method="POST" action="#" role="none">
    //           <button
    //             type="submit"
    //             className="block w-full px-4 py-2 text-left text-sm text-gray-700"
    //             role="menuitem"
    //             tabIndex={-1}
    //             id="menu-item-3"
    //           >
    //             Sign out
    //           </button>
    //         </form>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export default ProfileDropdown;
