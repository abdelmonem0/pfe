import { Paper, Typography, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { calculateGeneral, calculateProjectsStatistics } from "./Calculations";

function Statistics(props) {
  const projects = useSelector((state) => state.projects.dataArray);
  const theme = useTheme();
  const [state, setState] = useState({});

  useEffect(() => {
    if (projects) {
      const projectsStatistics = calculateProjectsStatistics(theme);
      const generalStatistics = calculateGeneral(theme);
      setState({ ...state, projectsStatistics, generalStatistics });
    }
  }, []);
  return (
    <div style={{ display: "flex", flex: "1" }}>
      <div style={{ flex: "1 1 50%", maxWidth: "20rem" }}>
        <DoughnutChart state={state.projects.dataArrayStatistics} />
      </div>
      <div style={{ flex: "1 1 50%", maxWidth: "35rem" }}>
        <GeneralStatistics state={state.generalStatistics} />
      </div>
    </div>
  );
}

export default Statistics;

const DoughnutChart = ({ state }) => {
  return (
    (state && (
      <Paper style={{ padding: "0.5rem" }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          {state.title}
        </Typography>
        <Doughnut
          data={state.data}
          options={{
            title: {
              display: true,
              text: "Average Rainfall per month",
              fontSize: 15,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </Paper>
    )) ||
    null
  );
};

const GeneralStatistics = ({ state }) => {
  return (
    (state && (
      <Paper>
        <Bar
          data={state}
          options={{
            title: {
              display: true,
              text: "Average Rainfall per month",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </Paper>
    )) ||
    null
  );
};
