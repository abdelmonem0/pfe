import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import LikeButton from "../../LikeButton";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Project_States } from "../../../../Constants";
import "../style.css";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function TableView(props) {
  const { projects, openProject, current } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProject, setSelectedProject] = useState([]);

  const classes = useRowStyles();

  const sliceStart =
    page * rowsPerPage < projects.length ? page * rowsPerPage : 0;
  const sliceEnd =
    page * rowsPerPage + rowsPerPage < projects.length
      ? page * rowsPerPage + rowsPerPage
      : projects.length;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleExpandMore = (id) => {
    if (selectedProject.indexOf(id) === -1) {
      setSelectedProject([...selectedProject, id]);
    } else {
      setSelectedProject(
        selectedProject.filter((sp) => {
          return sp !== id;
        })
      );
    }
  };

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell padding="checkbox">Etat</TableCell>
              <TableCell>Projet</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Lieu</TableCell>
              <TableCell align="right">Encadrant interne</TableCell>
              <TableCell align="right">Encadrant externe</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.slice(sliceStart, sliceEnd).map((project, idx) => (
              <React.Fragment>
                <TableRow key={project.id_sujet} className={classes.root}>
                  <TableCell padding="checkbox">
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleExpandMore(project.id_sujet)}
                      >
                        {selectedProject.indexOf(project.id_sujet) !== -1 ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                      {project.affecte_a.length === 0 && (
                        <LikeButton project={project} current={current} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Badge
                      etat={project.etat}
                      current={current}
                      affecte_a={project.affecte_a}
                    />
                  </TableCell>
                  <TableCell onClick={() => openProject(project)}>
                    <div className="project-title-table-view">
                      {project.titre}
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {project.interne ? "Interne" : "Externe"}
                  </TableCell>
                  <TableCell align="right">{project.lieu}</TableCell>
                  <TableCell align="right">
                    {project.encadrants[0].nom}
                    {project.encadrants[1]
                      ? " / " + project.encadrants[1].nom
                      : ""}
                  </TableCell>
                  <TableCell align="right">{project.enc_ext || ""}</TableCell>
                </TableRow>
                <TableRow key={idx}>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                  >
                    <Collapse
                      in={selectedProject.indexOf(project.id_sujet) !== -1}
                    >
                      <Box padding={1}>
                        <Typography variant="body1" color="primary">
                          Decription
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {project.description}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          Travail
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {project.travail}
                        </Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={projects.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default TableView;

const Badge = ({ etat, current, affecte_a }) => {
  const _etat =
    current.role === "president"
      ? etat === Project_States.waiting
        ? "En instance"
        : etat
      : affecte_a.length > 0
      ? "Affecté"
      : "En instance";
  const chipColor =
    current.role === "president"
      ? etat === Project_States.accepted
        ? "primary"
        : etat === Project_States.refused
        ? "secondary"
        : "default"
      : affecte_a.length > 0
      ? "primary"
      : "default";
  const chipStyle =
    current.role === "president"
      ? etat !== Project_States.waiting
        ? "default"
        : "outlined"
      : affecte_a.length > 0
      ? "default"
      : "outlined";
  return (
    <Chip color={chipColor} variant={chipStyle} size="small" label={_etat} />
  );
};
