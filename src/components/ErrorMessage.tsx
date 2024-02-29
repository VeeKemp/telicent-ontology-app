import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="grid auto-rows-min col-span-12 justify-center self-center gap-y-12 text-center">
    <pre className="text-9xl">(◎_◎;)</pre>
    <p>{message}</p>
  </div>
);

export default ErrorMessage;
