  import {
  TeliButton,
  TeliDialog,
  TeliDialogActions,
  TeliDialogContent,
  TeliDialogTitle,
} from "@telicent-oss/ds";
import React from "react";

interface AlertDialogProps {
  open: boolean;
  title: string;
  content: string;
  onAccept: () => void;
  onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  content,
  onAccept,
  onClose,
}) => {
  const handleClose = () => {
    onClose();
  };

  const handleAccept = () => {
    onAccept();
  };

  return (
    <TeliDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <TeliDialogTitle id="alert-dialog-title">{title}</TeliDialogTitle>
      <TeliDialogContent>{content}</TeliDialogContent>
      <TeliDialogActions>
        <TeliButton onClick={handleClose} autoFocus>
          Cancel
        </TeliButton>
        <TeliButton onClick={handleAccept}>OK</TeliButton>
      </TeliDialogActions>
    </TeliDialog>
  );
};

export default AlertDialog;
