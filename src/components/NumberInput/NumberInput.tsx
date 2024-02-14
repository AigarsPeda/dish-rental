import { type FC } from "react";

interface NumberInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
}

const NumberInput: FC<NumberInputProps> = ({ id, value, onChange }) => {
  return (
    <div className="relative flex items-center">
      <button
        type="button"
        id="decrement-button"
        data-input-counter-decrement={id}
        className="h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
        onClick={() => {
          if (value > 1) {
            onChange(value - 1);
          }
        }}
      >
        <svg
          className="h-3 w-3 text-gray-900"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        type="text"
        id={id}
        data-input-counter
        aria-describedby="helper-text-explanation"
        className="block h-11 w-full border border-x-0 border-gray-300 bg-gray-100 py-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <button
        type="button"
        id="increment-button"
        data-input-counter-increment={id}
        className="h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
        onClick={() => {
          onChange(value + 1);
        }}
      >
        <svg
          className="h-3 w-3 text-gray-900"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default NumberInput;
