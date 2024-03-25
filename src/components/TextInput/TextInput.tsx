import { type FC } from "react";
import classNames from "~/utils/classNames";

interface TextInputProps {
  name: string;
  value: string;
  isRequired?: boolean;
  onChange: (e: string) => void;
  labelSize?: "small" | "medium" | "large";
  type?: "text" | "password" | "email" | "tel";
}

const TextInput: FC<TextInputProps> = ({
  name,
  value,
  onChange,
  isRequired,
  type = "text",
  labelSize = "medium",
}) => {
  return (
    <>
      <label
        htmlFor="product-name"
        className={classNames(
          labelSize === "small" && "text-sm",
          labelSize === "medium" && "text-base",
          "block font-medium leading-6 text-gray-900",
        )}
      >
        {name}
      </label>
      <div
        className={classNames(
          labelSize === "small" && "mt-0",
          labelSize === "medium" && "mt-2",
          "w-full",
        )}
      >
        <input
          type={type}
          value={value}
          autoComplete="on"
          id="product-name"
          name="product-name"
          required={isRequired}
          className={classNames(
            "focus:shadow-outline block w-full rounded-md bg-transparent bg-white px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-slate-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-800 sm:text-sm sm:leading-6",
          )}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export default TextInput;
