import { type FC } from "react";

interface ToggleProps {
  label?: string;
  isChecked: boolean;
  handleChange: (checked: boolean) => void;
}

const Toggle: FC<ToggleProps> = ({ label, isChecked, handleChange }) => {
  return (
    <label className="inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        value=""
        className="peer sr-only"
        checked={isChecked}
        onChange={() => handleChange(!isChecked)}
      />
      <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rtl:peer-checked:after:-translate-x-full"></div>
      {label && (
        <span className="ms-3 text-sm font-medium text-gray-900">{label}</span>
      )}
    </label>
  );
};

export default Toggle;
