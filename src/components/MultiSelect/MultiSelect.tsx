import { useRef, useState, type FC } from "react";
import { IoChevronDownOutline, IoClose } from "react-icons/io5";
import useDelayUnmount from "~/hooks/useDelayUnmount";
import useOnClickOutside from "~/hooks/useOnClickOutside";
import classNames from "~/utils/classNames";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  setSelected: (selected: string[]) => void;
}

const MultiSelect: FC<MultiSelectProps> = ({
  options,
  selected,
  setSelected,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));
  const { shouldRender, isAnimation } = useDelayUnmount(isDropdownOpen, 100);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex min-h-10 w-full flex-wrap items-center justify-start gap-x-1.5 rounded-md bg-gray-100 px-0.5 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:cursor-pointer hover:bg-gray-100 focus:ring-gray-800"
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selected.map((item) => (
          <button
            key={item}
            type="button"
            className="group relative rounded px-6 py-2 text-gray-800  transition-all hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              setSelected(selected.filter((i) => i !== item));
            }}
          >
            {item}
            <span className="absolute right-1 top-1 text-red-500 opacity-0 group-hover:opacity-100 ">
              <IoClose />
            </span>
          </button>
        ))}

        <button
          type="button"
          className={classNames(
            isDropdownOpen ? "rotate-180" : "rotate-0",
            "absolute right-4 top-1/2 -translate-y-1/2  transform  text-gray-800 transition-all",
          )}
        >
          <IoChevronDownOutline />
        </button>
      </div>
      {shouldRender && (
        <div
          role="menu"
          tabIndex={-1}
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          className={classNames(
            isAnimation
              ? "visible translate-x-0 scale-100 opacity-100"
              : "invisible scale-95 opacity-0",
            "absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-150 focus:outline-none",
          )}
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  if (selected.includes(option)) {
                    setSelected(selected.filter((item) => item !== option));
                  } else {
                    setSelected([...selected, option]);
                  }
                }}
                className={classNames(
                  selected.includes(option) && "bg-gray-100",
                  "block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
