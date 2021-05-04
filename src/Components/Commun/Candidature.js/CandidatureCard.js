import React, { useState, useEffect } from "react";
import CandidatureBottom from "./CandidatureBottom";
import CandidatureHeader from "./CandidatureHeader";
import CandidatureBody from "./CandidatureBody";
import { Collapse, Paper } from "@material-ui/core";
import { Candidature_States } from "../../../Constants";

function CandidatureCard(props) {
  const { candidature, collapse } = props;
  const [open, setOpen] = useState(
    collapse ? false : candidature.etat !== Candidature_States.inactive
  );

  useEffect(() => {
    setOpen(
      collapse ? false : candidature.etat !== Candidature_States.inactive
    );
  }, [collapse]);

  return (
    <>
      <Paper className="candidature-card" variant="outlined">
        <CandidatureHeader
          candidature={candidature}
          setOpen={setOpen}
          open={open}
        />
        <Collapse in={open}>
          <CandidatureBody candidature={candidature} />
        </Collapse>
        <CandidatureBottom candidature={candidature} />
      </Paper>
    </>
  );
}

export default CandidatureCard;
