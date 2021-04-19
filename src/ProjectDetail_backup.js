import React from "react";
import { Chip, Button, Tooltip } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

function ProjectDetail(props) {
  const candidatures = useSelector((state) => state.candidatures);
  const current = useSelector((state) => state.users.current);
  const dispatch = useDispatch();
  const project = props.project;
  return (
    <>
      <div className="header">
        <h4>{project.titre}</h4>
      </div>
      <div className="body">
        <div className="body-info">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <span
                style={{
                  fontWeight: "bold",
                  marginRight: "0.5rem",
                }}
              >
                {project.encadrants.length === 1 ? "Encadrant" : "Encadrants"}
              </span>

              {project.encadrants.map((e) => (
                <span style={{ marginRight: "1rem" }}>{"• " + e.nom}</span>
              ))}
            </div>
            <span>
              Ajouté le{" "}
              {project.date_creation.substring(
                0,
                project.date_creation.indexOf("T")
              )}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{project.interne ? "Interne" : "Externe"}</span>
            {project.enc_ext && (
              <span>Encadrant exterieur: {project.enc_ext}</span>
            )}
            <span>Lieu: {project.interne ? "ISIMG" : project.lieu}</span>
          </div>
          <div style={{ display: "flex", gap: "0.2rem", flexWrap: "wrap" }}>
            <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
              {"Technologies"}
            </span>
            {project.tags.map((p) => (
              <Chip label={p.id_tag} size="small" />
            ))}
          </div>
        </div>
        <h5>Description</h5>
        <span>{project.description}</span>
        <h5>Travail</h5>
        <span>{project.travail}</span>
      </div>
      <div style={{ padding: "0.5rem", display: "flex", gap: "1rem" }}>
        {candidatures.length < 3 && (
          <Tooltip
            title={
              "Il vous reste " + (3 - candidatures.length) + " candidatures."
            }
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch({ type: "GO", payload: "ViewCandidature" });
              }}
            >
              Postuler
            </Button>
          </Tooltip>
        )}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => props.closeProject()}
        >
          Fermer
        </Button>
      </div>
    </>
  );
}

export default ProjectDetail;
