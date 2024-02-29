import React from "react";

interface SelectNode {
  handleMenuClick: (type: string) => void;
  menuIsOpen: boolean;
}

const SelectNode: React.FC<SelectNode> = ({ handleMenuClick, menuIsOpen }) => {
  if (!menuIsOpen) return;

  return (
    <div className="flex bg-black-50 p-1 rounded-md">
      <div
        className="hover:bg-whiteSmoke-700 pt-1 px-2 rounded-md cursor-pointer"
        onClick={() => handleMenuClick("class")}
      >
        <button title="class">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="14"
            viewBox="0 0 22 14"
            fill="none"
          >
            <rect
              x="0.5"
              y="0.5"
              width="21"
              height="13"
              rx="3.5"
              stroke="#F5F5F5"
            />
          </svg>
        </button>
      </div>
      <div
        className="hover:bg-whiteSmoke-700 pt-1 px-2 rounded-md cursor-pointer"
        onClick={() => handleMenuClick("dataTypeProperty")}
      >
        <button title="data type property">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="14"
            viewBox="0 0 32 14"
            fill="none"
          >
            <rect
              x="0.239247"
              y="0.426624"
              width="22.4432"
              height="15.4079"
              transform="matrix(1 0 -0.521507 0.853247 8.77931 0.0626082)"
              stroke="#F5F5F5"
            />
          </svg>
        </button>
      </div>
      <div
        className="hover:bg-whiteSmoke-700 pt-1 px-2 rounded-md cursor-pointer"
        onClick={() => handleMenuClick("objectProperty")}
      >
        <button title="object property">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="14"
            viewBox="0 0 32 14"
            fill="none"
          >
            <path
              d="M31.2009 7L23.097 13.5H8.9189L0.800024 7L8.91894 0.5H23.097L31.2009 7Z"
              stroke="#F5F5F5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SelectNode;
