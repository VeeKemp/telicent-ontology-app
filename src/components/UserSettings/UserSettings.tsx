import React, { useState } from "react";
import { TeliButton, TeliCloseIcon, TeliDialog } from "@telicent-oss/ds";

import SettingsMenuItems, { TSettingsMenuItems } from "./SettingsMenuItems";
import Namespaces from "./Namespaces/Namespaces";
import "./settings.css";

type UserSettingsProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Allows User to create namespaces
 */
const UserSettings: React.FC<UserSettingsProps> = ({ open, onClose }) => {
  const [selectedItem, setSelectedItem] =
    useState<TSettingsMenuItems>("namespaces");

  const handleMenuItemSelection = (menuItem: TSettingsMenuItems) => {
    setSelectedItem(menuItem);
  };

  return (
    <TeliDialog open={open} onClose={onClose} className="user-settings-modal">
      <div className="p-6 space-y-6">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium">Settings</h2>
          <TeliButton aria-label="close" onClick={onClose}>
            <TeliCloseIcon />
          </TeliButton>
        </div>
        <div className="flex gap-x-3">
          <SettingsMenuItems
            selected={selectedItem}
            onClick={handleMenuItemSelection}
          />
          <div className="p-2 space-y-5">
            <Namespaces hide={selectedItem !== "namespaces"} />
          </div>
        </div>
      </div>
    </TeliDialog>
  );
};

export default UserSettings;
