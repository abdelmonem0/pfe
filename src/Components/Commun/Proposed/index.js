import { Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import CardView from "../ViewProjects/Views/CardView";

function Proposed(props) {
  const self = props.self;
  const projects = useSelector((state) =>
    self ? state.projects.self : state.projects.proposed
  );
  return (
    <div style={{ flex: 1 }}>
      <Typography variant="h4">
        {self ? "Mes sujets" : "Sujets proposés par des étudiants"} (
        {projects.length})
      </Typography>
      <div className="vertical-list">
        <CardView projects={projects} />
      </div>
    </div>
  );
}

export default Proposed;
