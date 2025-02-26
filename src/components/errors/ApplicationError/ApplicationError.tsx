import React from "react";
import Error404Component from "../../../modules/Home/components/Error404Component";

const ApplicationError: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      <Error404Component />
    </div>
  );
};

export default ApplicationError;
