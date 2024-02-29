import React from "react";

interface ButtonClickProps {
  onClick: () => void;
  active: boolean;
}

const SelectButton: React.FC<ButtonClickProps> = ({ onClick, active }) => (
  <button
    className={`pan-btn px-2 rounded-md ${
      active ? "bg-black-600" : ""
    } hover:bg-black-600`}
    onClick={onClick}
    title="Select"
  >
    <i className="fa-solid fa-mouse-pointer text-2xl" />
  </button>
);

export default SelectButton;
