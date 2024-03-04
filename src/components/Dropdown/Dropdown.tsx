import { useRef, type FC, type ReactNode } from "react";
import useDelayUnmount from "~/hooks/useDelayUnmount";
import useOnClickOutside from "~/hooks/useOnClickOutside";
import classNames from "~/utils/classNames";

interface DropdownProps {
  children: ReactNode;
  isDropdownOpen: boolean;
  isDisableArrow?: boolean;
  title: string | ReactNode;
  width?: "w-56" | "w-64" | "w-80" | "w-96";
  setIsDropdownOpen: (value: boolean) => void;
}

const Dropdown: FC<DropdownProps> = ({
  title,
  children,
  width = "w-56",
  isDropdownOpen,
  isDisableArrow,
  setIsDropdownOpen,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));
  const { shouldRender, isAnimation } = useDelayUnmount(isDropdownOpen, 100);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-md bg-gray-100 py-2 pl-2 pr-3 text-sm font-semibold text-gray-800 transition-all hover:bg-gray-200"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {title}
          {!isDisableArrow && (
            <svg
              className="-mr-1 h-6 w-6 text-gray-800"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {shouldRender && (
        <div
          className={classNames(
            isAnimation
              ? "visible translate-x-0 scale-100 opacity-100"
              : "invisible scale-95 opacity-0",
            width === "w-56" && "w-56",
            width === "w-64" && "w-64",
            width === "w-80" && "w-80",
            width === "w-96" && "w-96",
            "absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-150 focus:outline-none",
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
