import React from "react";
import "./style.css";

function Loading() {
  return (
    <div className="main">
      <div className="background" />
      <div className="container">
        <div className="animation-container">
          <div className="circle c1" />
          <div className="circle c2" />
          <div className="circle c3" />
          <div className="circle c4" />
        </div>
        <div className="animation-container-2">
          <div className="circle cc1" />
          <div className="circle cc2" />
          <div className="circle cc3" />
          <div className="circle cc4" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
