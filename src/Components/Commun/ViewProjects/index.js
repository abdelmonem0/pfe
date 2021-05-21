import { React, useEffect, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import "./style.css";
import { getCandidatures, getProjects } from "../../../functions";
import FiltreProjects from "./Filter/FiltreProjects";
import CardView from "./Views/CardView";
import TableView from "./Views/TableView";
import { ViewAgenda, ViewHeadline } from "@material-ui/icons";

function ViewProjects() {
  const current = useSelector((state) => state.users.current);
  const fetchedProjects = useSelector((state) => state.projects.dataArray);
  const dispatch = useDispatch();

  const [projects, setProjects] = useState(fetchedProjects);
  const [cardView, setCardView] = useState(true);

  useEffect(() => {
    getProjects()
      .then((result) => {
        dispatch({ type: "SET_PROJECTS", payload: result.data });
      })
      .then(() => {
        getCandidatures(current.id_utilisateur).then((result) =>
          dispatch({ type: "SET_CANDIDATURES", payload: result.data })
        );
      });
  }, []);

  return (
    projects && (
      <div className="vertical-list">
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <Typography variant="h4" paragraph>
            List des sujets
          </Typography>
          <SwitchView cardView={cardView} setCardView={setCardView} />
        </div>
        {/* <FiltreProjects /> */}
        <FiltreProjects
          projects={projects}
          setProjects={setProjects}
          fetchedProjects={fetchedProjects}
        />

        {cardView ? (
          <CardView projects={projects} />
        ) : (
          <TableView projects={projects} current={current} />
        )}
      </div>
    )
  );
}

export default ViewProjects;

const SwitchView = (props) => {
  const { cardView, setCardView } = props;

  const handleClick = (isViewCard) => {
    setCardView(isViewCard);
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button
        color="primary"
        disabled={cardView}
        onClick={() => handleClick(true)}
      >
        <ViewAgenda />
      </Button>
      <Button
        color="primary"
        disabled={!cardView}
        onClick={() => handleClick(false)}
      >
        <ViewHeadline />
      </Button>
    </div>
  );
};
