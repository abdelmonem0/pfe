import { Typography, useTheme } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import "./style.css";

function Loading() {
  const theme = useTheme();

  return (
    <div className="main" style={{ top: window.scrollY }}>
      <div className="animation-container-1" style={{ position: "relative" }}>
        <div
          className="animation-container"
          style={{ animationDelay: "0" }}
        ></div>
        <div
          className="animation-container"
          style={{ animationDelay: "150ms" }}
        >
          <div className="circle"></div>
        </div>
        <div
          className="animation-container"
          style={{ animationDelay: "300ms" }}
        >
          <div className="circle"></div>
        </div>
        <div
          className="animation-container"
          style={{ animationDelay: "450ms" }}
        >
          <div className="circle"></div>
        </div>
        <div
          className="animation-container"
          style={{ animationDelay: "600ms" }}
        >
          <div className="circle"></div>
        </div>
        <div
          className="animation-container"
          style={{ animationDelay: "750ms" }}
        >
          <div className="circle"></div>
        </div>
      </div>

      <div className="background" />
    </div>
  );
}

export default Loading;
