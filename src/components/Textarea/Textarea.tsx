import { type FC } from "react";

interface TextareaProps {
  value: string;
  onChange: (str: string) => void;
}

const Textarea: FC<TextareaProps> = ({ value, onChange }) => {
  return (
    <textarea
      rows={3}
      id="product-description"
      name="product-description"
      className="block w-full rounded-md border-0 bg-white px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    ></textarea>
  );
};

export default Textarea;
