import React from "react";
import { FaSpinner } from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";

const LoadingSpinner = () => {
  return (
    <div className=" relative">
      <CgSpinner className="animate-spin text-3xl absolute" />
    </div>
  );
};

export default LoadingSpinner;
