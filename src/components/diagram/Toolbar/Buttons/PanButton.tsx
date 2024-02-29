import React from "react";

interface ButtonClickProps {
  onClick: () => void;
  active: boolean;
}

const PanButton: React.FC<ButtonClickProps> = ({ onClick, active }) => (
  <button
    className={`pan-btn px-1 rounded-md ${
      active ? "bg-black-600" : ""
    } hover:bg-black-600`}
    onClick={onClick}
    title="Pan"
  >
    <i className="fa-solid fa-hand-pointer text-2xl" />
  </button>
);

export default PanButton;
