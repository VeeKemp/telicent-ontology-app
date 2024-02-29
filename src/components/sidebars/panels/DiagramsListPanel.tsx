import React, { ChangeEvent, useState } from "react";
import { DiagramSummary } from "../../../services/ApiManager";
import { TeliList, TeliListItemButton, TeliTextField } from "@telicent-oss/ds";

interface DiagramsListPanelProps {
  diagrams: DiagramSummary[];
  handleItemClick: (id: string) => Promise<void>;
}

const DiagramsListPanel: React.FC<DiagramsListPanelProps> = ({
  diagrams,
  handleItemClick,
}) => {
  const [selectedItem, setSelectedItem] = useState("Agreement");
  const [searchTerm, setSearchTerm] = useState("");

  if (diagrams.length < 1) return null;

  const filteredDiagrams = diagrams.filter((diagram) =>
    diagram.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const diagramClick = (item: DiagramSummary) => {
    handleItemClick(item.uri);
    setSelectedItem(item.name);
  };

  return (
    <div className="w-full flex flex-col p-2 bg-black-200 rounded-lg shadow flex-grow gap-y-2 overflow-hidden">
      <h2 className="description text-lg font-semibold">Diagrams</h2>
      <TeliTextField
        fullWidth
        required
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search diagrams..."
      />
      <div className="overflow-y-auto">
        <TeliList>
          {filteredDiagrams.map((item) => (
            <TeliListItemButton
              key={item.uuid}
              onClick={() => diagramClick(item)}
              selected={item.name === selectedItem}
            >
              {item.name}
            </TeliListItemButton>
          ))}
        </TeliList>
      </div>
    </div>
  );
};
export default DiagramsListPanel;
