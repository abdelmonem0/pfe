import React from "react";
import {
  Table,
  TableRow,
  TableCell,
  useTheme,
  Paper,
  Typography,
} from "@material-ui/core";
import { getProjectByID } from "../Enseignant/Candidatures/logic";
import { getUserByID } from "./Candidature.js/CandidatureLogic";
import { useSelector } from "react-redux";

function getCrenaux(soutenances, crenau, date) {
  return soutenances.filter((s) => s.crenau === crenau && s.date === date);
}

function get_days(soutenances, day) {
  return soutenances.filter((s) => s.date === day);
}

export default function SoutenancesTable(props) {
  const current = useSelector((state) => state.users.current);
  const theme = useTheme();
  const { soutenances } = props;
  var renderedCrenaux = [];
  var renderedDays = [];

  function getCrenau(s) {
    if (renderedCrenaux.indexOf(s.crenau + s.date) < 0) {
      const crenaux = getCrenaux(soutenances, s.crenau, s.date);
      renderedCrenaux.push(s.crenau + s.date);
      return (
        <TableCell
          style={{ border: "1px solid gray" }}
          rowSpan={crenaux.length}
        >
          {s.crenau}
        </TableCell>
      );
    }
    return null;
  }

  function getDay(s) {
    if (renderedDays.indexOf(s.date) < 0) {
      const days = get_days(soutenances, s.date);
      renderedDays.push(s.date);
      return (
        <TableCell style={{ border: "1px solid gray" }} rowSpan={days.length}>
          {s.date}
        </TableCell>
      );
    }
    return null;
  }

  return (
    (soutenances && soutenances.length > 0 && (
      <>
        <Typography variant="h5">Mes soutenances</Typography>
        <Paper style={{ padding: "0.5rem 0.5rem" }}>
          <Table size="small">
            <TableRow>
              <TableCell style={{ border: "1px solid gray" }}>Jour</TableCell>
              <TableCell style={{ border: "1px solid gray" }}>Crénau</TableCell>
              <TableCell style={{ border: "1px solid gray" }}>Sale</TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                Etudiant
              </TableCell>
              <TableCell style={{ border: "1px solid gray" }}>Sujet</TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                Encadreur
              </TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                Rapporteur
              </TableCell>
              <TableCell style={{ border: "1px solid gray" }}>
                Président
              </TableCell>
            </TableRow>
            {soutenances
              .sort((a, b) => a.crenau > b.crenau)
              .sort((a, b) => a.date > b.date)
              .map((soutenance) => (
                <TableRow>
                  {getDay(soutenance)}
                  {getCrenau(soutenance)}
                  <TableCell style={{ border: "1px solid gray" }}>
                    {soutenance.sale}
                  </TableCell>
                  <TableCell style={{ border: "1px solid gray" }}>
                    {getAllStudents(soutenance.id_sujet)}
                  </TableCell>
                  <TableCell style={{ border: "1px solid gray" }}>
                    {getProjectByID(soutenance.id_sujet)?.titre ||
                      "Non définit"}
                  </TableCell>
                  <TableCell style={{ border: "1px solid gray" }}>
                    {getAllEncadrants(soutenance.id_sujet)}
                  </TableCell>
                  <TableCell style={{ border: "1px solid gray" }}>
                    {(soutenance.invite &&
                      soutenance.invite.length &&
                      (soutenance.invite.find((i) => i.role === "rapporteur")
                        ?.nom ||
                        "Non définit")) ||
                      "Non définit"}
                  </TableCell>
                  <TableCell style={{ border: "1px solid gray" }}>
                    {(soutenance.invite &&
                      soutenance.invite.length &&
                      (soutenance.invite.find((i) => i.role === "président")
                        ?.nom ||
                        "Non définit")) ||
                      "Non définit"}
                  </TableCell>
                </TableRow>
              ))}
          </Table>
        </Paper>
      </>
    )) ||
    null
  );
}

function getAllEncadrants(project_id) {
  const project = getProjectByID(project_id);
  if (!project) return "Sujet non définit";
  var encadrants = "";
  var user = null;

  if (project.enc_prim) {
    user = getUserByID(project.enc_prim);
    if (user) encadrants += user.nom;
  }

  if (project.enc_sec) {
    user = getUserByID(project.enc_sec);
    if (user) encadrants += " / " + user.nom;
  }

  if (project.enc_ext) encadrants += " / " + project.enc_ext;

  return encadrants;
}

function getAllStudents(project_id) {
  const project = getProjectByID(project_id);
  if (!project) return "Sujet non définit";
  var students = "";

  if (project.affecte_a[0]) {
    students += project.affecte_a[0].nom;
  }
  if (project.affecte_a[1]) {
    students += " / " + project.affecte_a[1].nom;
  }

  return students;
}
