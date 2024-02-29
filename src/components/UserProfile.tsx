import React, { useState } from "react";
import { TeliUserProfile } from "@telicent-oss/ds";
import UserSettings from "./UserSettings/UserSettings";

const UserProfile: React.FC = () => {
  const [openSettings, setOpenSettings] = useState(false);

  const handleOpenSettingsModal = () => {
    setOpenSettings(true);
  };

  const handleCloseSettingsModal = () => {
    setOpenSettings(false);
  };

  return (
    <>
      <TeliUserProfile onSettingsClick={handleOpenSettingsModal} />
      <UserSettings open={openSettings} onClose={handleCloseSettingsModal} />
    </>
  );
};

export default UserProfile;
