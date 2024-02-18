import { type FC } from "react";

interface TextInputProps {
  name: string;
  value: string;
  onChange: (e: string) => void;
}

const TextInput: FC<TextInputProps> = ({ name, value, onChange }) => {
  return (
    <>
      <label
        htmlFor="product-name"
        className="block font-medium leading-6 text-gray-900"
      >
        {name}
      </label>
      <div className="mt-2">
        <input
          type="text"
          id="product-name"
          name="product-name"
          autoComplete="given-name"
          className="block w-full rounded-md border-0 bg-transparent px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export default TextInput;
