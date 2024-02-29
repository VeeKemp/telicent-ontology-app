import React from "react";
import { toPng } from "html-to-image";

const ScreenshotButton: React.FC = () => {
  const downloadImage = (dataUrl: string) => {
    const a = document.createElement("a");

    a.setAttribute("download", "ontology.png");
    a.setAttribute("href", dataUrl);
    a.click();
  };

  const onClick = () => {
    const element = document.querySelector(".react-flow") as HTMLElement;
    toPng(element, {
      filter: (node) => {
        // we don't want to add the minimap and the controls to the image
        if (
          node?.classList?.contains("react-flow__minimap") ||
          node?.classList?.contains("react-flow__controls")
        ) {
          return false;
        }

        return true;
      },
    }).then(downloadImage);
  };

  return (
    <button
      className="download-btn px-1 rounded-md hover:bg-black-600"
      onClick={onClick}
      title="Download image"
    >
      <i className="ri-screenshot-2-line text-2xl" />
    </button>
  );
};

export default ScreenshotButton;
