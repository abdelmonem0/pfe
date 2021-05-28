import { Divider, Paper, Tooltip, Typography } from "@material-ui/core";
import { AccountTree, Place, Schedule } from "@material-ui/icons";
import React from "react";
import { useSelector } from "react-redux";
import { getProjectByID } from "../../Enseignant/Candidatures/logic";
import ProjectDetail from "../ProjectDetail";
import { getUserSoutenances } from "./logic";

function SoutenancesDetails() {
  const current = useSelector((state) => state.users.current);
  const soutenances = getUserSoutenances();

  return (
    <Paper style={{ padding: "0.5rem" }}>
      <Typography variant="h5" paragraph>
        Vos soutenances
      </Typography>
      <div
        className="horizontal-list wrap"
        style={{ alignItems: "flex-start" }}
      >
        {soutenances.map((s) => (
          <Soutenance soutenance={s} />
        ))}
      </div>
    </Paper>
  );
}

export default SoutenancesDetails;

const Soutenance = (props) => {
  const { soutenance } = props;
  const current = useSelector((state) => state.users.current);
  const project = getProjectByID(soutenance.id_sujet);

  return (
    (project && (
      <Paper
        variant="outlined"
        key={soutenance.id_soutenance}
        style={{ flex: "1 1 32%", minWidth: "16rem", padding: "0.5rem" }}
        className="vertical-list"
      >
        <div className="horizontal-list space-between">
          <Tooltip title="Date soutenance">
            <Typography gutterBottom variant="h6">
              <Schedule /> {soutenance.date}
            </Typography>
          </Tooltip>

          <Tooltip title="Sale">
            <Typography gutterBottom variant="h6">
              <Place /> {soutenance.sale}
            </Typography>
          </Tooltip>
        </div>
        <div className="horizontal-list space-between wrap">
          <Typography variant="h6">Crénau {soutenance.crenau}</Typography>
          <Typography variant="h6">
            Votre rôle:{" "}
            {
              soutenance.invite.find(
                (i) => i.id_utilisateur === current.id_utilisateur
              ).role
            }
          </Typography>
        </div>
        <ProjectDetail project={project}>
          <Tooltip title="Titre du sujet affecté à cette soutenance">
            <Typography paragraph>
              <AccountTree /> {project.titre}
            </Typography>
          </Tooltip>
        </ProjectDetail>

        <Divider />
        <Typography>Autres invités</Typography>
        {soutenance.invite
          .filter((i) => i.id_utilisateur !== current.id_utilisateur)
          .map((i) => (
            <div
              key={i.id_utilisateur}
              className="horizontal-list wrap space-between"
            >
              <Typography>{i.nom}</Typography>
              <Typography>{i.role}</Typography>
            </div>
          ))}
      </Paper>
    )) || <div>{soutenance.id_sujet}</div>
  );
};
