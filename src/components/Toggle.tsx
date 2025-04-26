import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full relative transition">
        <span
          className={`absolute w-6 h-6 rounded-full transition-transform ${
            checked ? 'bg-blue-600 translate-x-0' : 'bg-gray-400 translate-x-6'
          }`}
        ></span>
      </div>
      <span className="hidden ml-2 text-sm">{label}</span>
    </label>
  );
};

export default Toggle;
