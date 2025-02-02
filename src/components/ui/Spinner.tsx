import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center w-full items-center min-h-screen flex-col ">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <h1>Please wait...</h1>
    </div>
  );
};

export default Spinner;
