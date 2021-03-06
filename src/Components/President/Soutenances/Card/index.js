import React, { useEffect, useState } from "react";
import { Collapse, TextField, Typography, useTheme } from "@material-ui/core";
import {
  assignSingleTeacher,
  getSoutenanceAvailable,
  getProject,
  setSoutenanceInvited,
} from "../SoutenanceLogic";
import Chooser from "./Chooser";
import Header from "./Header";
import { useSelector } from "react-redux";
import ProjectChooser from "./ProjectChooser";

function SoutenanceCard(props) {
  const { soutenance, saved } = props;
  const [showStudents, setShowStudents] = useState(false);
  const soutenances = useSelector((state) => state.soutenance.soutenances);
  const [available, setAvailable] = useState(null);
  const assigne = (option, role) => {
    if (!option) return;
    assignSingleTeacher(soutenance, option, role);
  };

  const [buttonsVisible, setButtonsVisible] = useState(false);

  const president = soutenance.invite.find((u) => u.role === "président") || {
    id_utilisateur: "0",
    nom: "",
    isAvailable: false,
  };
  const rapporteur = soutenance.invite.find((u) => u.role === "rapporteur") || {
    id_utilisateur: "0",
    nom: "",
    isAvailable: false,
  };
  const theme = useTheme();

  useEffect(() => {
    if (soutenance.id_sujet !== "" && !saved) {
      var _available = getSoutenanceAvailable(soutenance);
      setAvailable(_available);
      if (soutenance.invite.length === 0) setSoutenanceInvited(soutenance);
    }
  }, [soutenances]);

  return (
    <div
      style={{
        padding: "0.25rem",
        paddingLeft: "0.5rem",
        backgroundColor: theme.palette.background.default,
      }}
      onMouseEnter={() => {
        if (!saved) setButtonsVisible(true);
      }}
      onMouseLeave={() => setButtonsVisible(false)}
    >
      <Header
        soutenance={soutenance}
        buttonsVisible={buttonsVisible}
        showStudents={showStudents}
        setShowStudents={setShowStudents}
      />
      {soutenance.id_sujet === "" ? (
        <ProjectChooser soutenance={soutenance} />
      ) : (
        <div variant="outlined" style={{ padding: "0.25rem" }}>
          <Typography variant="subtitle2" gutterBottom>
            {getProject(soutenance.id_sujet)?.titre}
          </Typography>
          <div style={{ paddingLeft: "0.5rem" }}>
            <div className="vertical-list">
              {((available && available.length > 0) || saved) && (
                <div className="horizontal-list wrap">
                  <Chooser
                    available={available}
                    saved={saved}
                    assigne={assigne}
                    president={president}
                    rapporteur={false}
                  />
                  <Chooser
                    available={available}
                    saved={saved}
                    assigne={assigne}
                    rapporteur={rapporteur}
                    president={false}
                  />
                </div>
              )}
              <div className="horizontal-list wrap">
                {soutenance.invite.map(
                  (i, index) =>
                    i.role === "encadrant" && (
                      <TextField
                        key={index}
                        size="small"
                        variant="outlined"
                        label="Encadrant"
                        value={i.nom}
                        style={{ flex: "1 1 45%" }}
                        disabled
                      />
                    )
                )}
              </div>
              <Collapse in={showStudents}>
                <div className="horizontal-list wrap">
                  {soutenance.invite.map(
                    (i, index) =>
                      i.role === "etudiant" && (
                        <TextField
                          key={index}
                          size="small"
                          variant="outlined"
                          label="Etudiant"
                          value={i.nom}
                          style={{ flex: "1 1 45%" }}
                          disabled
                        />
                      )
                  )}
                </div>
              </Collapse>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SoutenanceCard;
