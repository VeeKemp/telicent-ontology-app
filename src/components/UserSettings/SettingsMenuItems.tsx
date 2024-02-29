import React from "react";
import { TeliMenuItem } from "@telicent-oss/ds";

type TSettingsMenuItems = "namespaces";

type SettingsMenuItemsProps = {
  selected: TSettingsMenuItems;
  onClick: (menuItem: TSettingsMenuItems) => void;
};

type MenuItems = {
  label: string;
  value: TSettingsMenuItems;
};

const MENU_ITEMS: MenuItems[] = [
  {
    label: "Namespaces",
    value: "namespaces",
  },
];

const SettingsMenuItems: React.FC<SettingsMenuItemsProps> = ({
  selected,
  onClick,
}) => {
  const handleMenuItemSelection = (menuItem: TSettingsMenuItems) => () => {
    onClick(menuItem);
  };

  return (
    <menu className="space-y-4 w-60">
      {MENU_ITEMS.map((menuItem) => (
        <TeliMenuItem
          key={menuItem.value}
          onClick={handleMenuItemSelection(menuItem.value)}
          selected={selected === menuItem.value}
        >
          {menuItem.label}
        </TeliMenuItem>
      ))}
    </menu>
  );
};

export default SettingsMenuItems;
export type { TSettingsMenuItems };
