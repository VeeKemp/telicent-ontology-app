import { Alert } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import {
  OntologyAlert,
  dismissMessage,
  selectAlerts,
} from "../../reducers/AlertSlice";

const AlertMessages: React.FC = () => {
  const dispatch = useAppDispatch();
  const alerts = useSelector(selectAlerts);

  const handleDismiss = (message: string) => {
    dispatch(dismissMessage(message));
  };

  if (!alerts || alerts.length == 0) {
    return null;
  }

  return (
    <div className="absolute bottom-10 left-10 right-10 z-10">
      <div className="flex flex-col items-center">
        {alerts.map((alert: OntologyAlert) => (
          <Alert
            severity={alert.severity}
            key={alert.message}
            onClose={() => handleDismiss(alert.message)}
          >
            {alert.message}
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default AlertMessages;
