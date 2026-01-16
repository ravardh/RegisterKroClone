import React from "react";

const NotFound = () => {
  return (
    <>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1 style={{ fontSize: "72px", marginBottom: "20px" }}>404</h1>
        <h2 style={{ fontSize: "36px", marginBottom: "20px" }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: "18px" }}>
          The page you are looking for does not exist.
        </p>
      </div>
    </>
  );
};

export default NotFound;
