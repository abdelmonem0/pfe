import { React, useEffect, useState } from "react";
import {
  Button,
  Hidden,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import "./style.css";
import { getCandidatures, getProjects } from "../../../functions";
import FiltreProjects from "./Filter/FiltreProjects";
import CardView from "./Views/CardView";
import EnhancedCardView from "./Views/EnhancedCardView";
import TableView from "./Views/TableView";
import { VerticalSplit, ViewAgenda, ViewHeadline } from "@material-ui/icons";
import { getAllProjects } from "../../redirectLogic";

function ViewProjects() {
  const current = useSelector((state) => state.users.current);
  const allProjects = getAllProjects();
  const fetchedProjects = allProjects._public;
  const dispatch = useDispatch();

  const [projects, setProjects] = useState(fetchedProjects);
  const [viewType, setViewType] = useState(0);

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
      <div className="vertical-list" style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <Typography variant="h4" paragraph>
            Liste des sujets
          </Typography>
          <Hidden smDown>
            <SwitchView cardView={viewType} setCardView={setViewType} />
          </Hidden>
        </div>
        {/* <FiltreProjects /> */}
        {fetchedProjects.length > 0 && (
          <FiltreProjects
            projects={projects}
            setProjects={setProjects}
            fetchedProjects={fetchedProjects}
          />
        )}

        {projects.length === 0 ? (
          fetchedProjects.length > 0 ? (
            <Typography variant="h4" color="secondary">
              Aucun sujet ne correspond aux filtres appliqués
            </Typography>
          ) : (
            <Typography variant="h4" color="primary">
              Pas des sujets encore
            </Typography>
          )
        ) : (
          <>
            <Hidden smDown>
              {viewType === 0 ? (
                <EnhancedCardView projects={projects} />
              ) : viewType === 1 ? (
                <CardView projects={projects} />
              ) : (
                <TableView projects={projects} current={current} />
              )}
            </Hidden>
            <Hidden mdUp>
              <CardView projects={projects} />
            </Hidden>
          </>
        )}
      </div>
    )
  );
}

export default ViewProjects;

const SwitchView = (props) => {
  const { cardView, setCardView } = props;

  return (
    <Tooltip title="Type de vue">
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <IconButton
          color="primary"
          disabled={cardView === 0}
          onClick={() => setCardView(0)}
        >
          <VerticalSplit />
        </IconButton>
        <IconButton
          color="primary"
          disabled={cardView === 1}
          onClick={() => setCardView(1)}
        >
          <ViewAgenda />
        </IconButton>
        <IconButton
          color="primary"
          disabled={cardView === 2}
          onClick={() => setCardView(2)}
        >
          <ViewHeadline />
        </IconButton>
      </div>
    </Tooltip>
  );
};
