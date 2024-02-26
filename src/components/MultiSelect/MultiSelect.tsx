import { useRef, useState, type FC } from "react";
import { IoChevronDownOutline, IoClose } from "react-icons/io5";
import useDelayUnmount from "~/hooks/useDelayUnmount";
import useOnClickOutside from "~/hooks/useOnClickOutside";
import classNames from "~/utils/classNames";

interface MultiSelectProps {
  id: string;
  selected: string[];
  isCustom?: boolean;
  isOneSelect?: boolean;
  options: Record<string, string>;
  setSelected: (selected: string[]) => void;
}

const MultiSelect: FC<MultiSelectProps> = ({
  id,
  options,
  isCustom,
  selected,
  isOneSelect,
  setSelected,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));
  const { shouldRender, isAnimation } = useDelayUnmount(isDropdownOpen, 100);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        id={id}
        className={classNames(
          isCustom
            ? "w-full rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
            : "rounded-md ring-1 ring-inset ring-gray-100",
          "flex min-h-10 w-full items-center justify-between gap-x-0.5 bg-white px-0.5 text-sm font-semibold text-gray-800 shadow-sm  hover:cursor-pointer focus:ring-gray-800",
        )}
        aria-expanded="true"
        aria-haspopup="true"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex w-full flex-wrap justify-center">
          {selected.length !== 0 ? (
            selected.map((item) => (
              <button
                key={item}
                type="button"
                className="group relative my-0.5 rounded px-2 py-2 text-gray-800 transition-all hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(selected.filter((i) => i !== item));
                }}
              >
                {options[item]}
                <span className="absolute right-0 top-0 text-red-500 opacity-0 group-hover:opacity-100 ">
                  <IoClose />
                </span>
              </button>
            ))
          ) : (
            <span className="pl-3 text-gray-400">Izvēlies kategorijas</span>
          )}
        </div>

        <button
          type="button"
          className={classNames(
            isDropdownOpen ? "rotate-180" : "rotate-0",
            "flex h-full w-10 transform items-center justify-center text-gray-800 transition-all",
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
            {Object.keys(options).map((option, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (isOneSelect) {
                    setSelected([option]);
                    setIsDropdownOpen(false);
                    return;
                  }

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
                {options[option]}
              </button>
            ))}
            {/* {options.map((option) => (
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
            ))} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
