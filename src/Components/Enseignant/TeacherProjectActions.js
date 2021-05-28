import { ButtonGroup, Button } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { Project_States } from "../../Constants";
import ConfirmDialog from "../Commun/ConfirmDialog";

function TeacherProjectAction(props) {
  const { project } = props;
  const current = useSelector((state) => state.users.current);
  const willShowUp =
    project.etat === Project_States.proposed_by_student_for_teacher &&
    (project.enc_prim === current.id_utilisateur ||
      project.enc_sec === current.id_utilisateur);

  return (
    willShowUp && (
      <>
        <ConfirmDialog
          title="Confirmer l'acceptation"
          body="Voulez-vous confirmer l'acceptation de cette proposition?"
          onConfirm={() => {}}
        >
          <Button size="small" color="primary" variant="outlined">
            Accepter
          </Button>
        </ConfirmDialog>
        <ConfirmDialog
          title="Confirmer le refus"
          body="Voulez-vous confirmer le refus de cette proposition?"
          onConfirm={() => {}}
        >
          <Button size="small" variant="outlined" color="secondary">
            Refuser
          </Button>
        </ConfirmDialog>
      </>
    )
  );
}

export default TeacherProjectAction;
