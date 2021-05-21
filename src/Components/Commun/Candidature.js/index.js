import { Button, makeStyles, Switch, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Candidature_States } from "../../../Constants";
import ProjectDetail from "../ProjectDetail";
import CandidatureCard from "./CandidatureCard";
import { getProjectsWithCandidatures } from "./CandidatureLogic";
import "./style.css";

const useStyles = makeStyles((theme) => ({
  sticky: {
    position: "sticky",
    top: theme.mixins.toolbar.minHeight,
    zIndex: theme.zIndex.appBar - 1,
    background: `linear-gradient(to bottom, ${theme.palette.background.default}E6 80%, ${theme.palette.background.default}00)`,
    borderRadius: 5,
    padding: theme.spacing(1, 0, 0.5, 0.5),
  },
}));

function Candidatures(props) {
  const users = useSelector((state) => state.users);
  const candidatures = useSelector((state) => state.candidatures).sort(
    (a, b) => {
      if (
        a.etat === Candidature_States.inactive &&
        b.etat !== Candidature_States.inactive
      )
        return 1;
      else return 0;
    }
  );
  const projects = useSelector((state) => state.projects.dataArray);

  const [byProjects, setByProjects] = useState(true);
  const [collapse, setCollapse] = useState(true);
  return candidatures.length > 0 ? (
    <div style={{ flex: "1" }}>
      {users.role !== "etudiant" && (
        <Sort
          byProjects={byProjects}
          setByProjects={setByProjects}
          collapse={collapse}
          setCollapse={setCollapse}
        />
      )}
      {projects.length > 0 &&
        (users.current.role === "etudiant" ? (
          <CandsByState collapse={collapse} candidatures={candidatures} />
        ) : byProjects ? (
          <CandsByTitle collapse={collapse} />
        ) : (
          <CandsByState collapse={collapse} candidatures={candidatures} />
        ))}
    </div>
  ) : (
    <div style={{ flex: "1" }}>
      <Typography variant="h5" color="secondary">
        Pas de candidatures.
      </Typography>
    </div>
  );
}

export default Candidatures;

const CandsByTitle = ({ collapse }) => {
  const classes = useStyles();
  return (
    <div>
      {getProjectsWithCandidatures().map((project) => (
        <div style={{ paddingBottom: "3rem" }}>
          <div className={classes.sticky}>
            <ProjectDetail project={project}>
              <Typography color="primary" variant="h4">
                {project.titre}
              </Typography>
            </ProjectDetail>
          </div>
          <div
            className="vertical-list index"
            style={{ paddingLeft: "0.5rem" }}
          >
            {project.candidatures.map((cand) => (
              <CandidatureCard
                collapse={collapse}
                candidature={cand}
                key={cand.id_candidature}
              />
            ))}
            {project.candidatures.length === 0 && (
              <Typography variant="h5">
                Ce sujet ne contient pas des candidatures
              </Typography>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const CandsByState = ({ candidatures, collapse }) => {
  return (
    <div className="vertical-list index">
      {candidatures.map((candidature) => (
        <CandidatureCard
          collapse={collapse}
          candidature={candidature}
          key={candidature.id_candidature}
        />
      ))}
    </div>
  );
};

const Sort = (props) => {
  const { byProjects, setByProjects, collapse, setCollapse } = props;
  return (
    <div
      className="horizontal-list"
      style={{ paddingBottom: "1rem", flexWrap: "wrap" }}
    >
      <Button
        variant="outlined"
        size="small"
        color="primary"
        disabled={byProjects}
        onClick={() => {
          setByProjects(!byProjects);
          setCollapse(true);
        }}
      >
        Trier par projet
      </Button>
      <Button
        variant="outlined"
        size="small"
        color="primary"
        disabled={!byProjects}
        onClick={() => {
          setByProjects(!byProjects);
          setCollapse(false);
        }}
      >
        Trier par état de candidature
      </Button>
      <Switch
        checked={collapse}
        color="primary"
        onChange={() => setCollapse(!collapse)}
      />
      <Typography>Collapse</Typography>
    </div>
  );
};
