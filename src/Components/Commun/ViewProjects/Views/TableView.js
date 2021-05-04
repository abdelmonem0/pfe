import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import LikeButton from "../../LikeButton";
import { Attachment, ExpandLess, ExpandMore } from "@material-ui/icons";
import "../style.css";
import AttachedFiles from "../../AttachedFiles";
import { useSelector } from "react-redux";
import AddCandidature from "../../../Etudiant/AddCandidature";
import CandidatButton from "../CandidatButton";
import ProjectDetail from "../../ProjectDetail";
import StateChip from "../StateChip";
import MembreProjectActions from "../../../Membre/MembreProjectActions";
import { canViewAttachement } from "../../Constraints";
import PresidentProjectActions from "../../../President/PresidentProjectActions";

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
  const [selectedRow, setSelectedRow] = useState("");
  const [expandAll, setExpandAll] = useState(false);

  const classes = useRowStyles();
  const theme = useTheme();
  const selectedRowColor = theme.palette.action.disabledBackground;

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
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setExpandAll(!expandAll)}
        style={{ textTransform: "none" }}
      >
        {!expandAll
          ? "Ouvrir tout les descriptions"
          : "Fermer tout les descriptions"}
      </Button>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell padding="checkbox">Etat</TableCell>
              <TableCell>Projet</TableCell>
              <TableCell align="left">Actions</TableCell>
              <TableCell align="left">Lieu</TableCell>
              <TableCell align="left">Encadrant interne</TableCell>
              <TableCell align="left">Encadrant externe</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.slice(sliceStart, sliceEnd).map((project, idx) => (
              <React.Fragment>
                <TableRow
                  key={project.id_sujet + "1"}
                  className={classes.root}
                  style={{
                    backgroundColor:
                      selectedRow === project.id_sujet
                        ? selectedRowColor
                        : "inherit",
                  }}
                  onClick={() => setSelectedRow(project.id_sujet)}
                >
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
                    <StateChip project={project} />
                  </TableCell>
                  <TableCell onClick={() => openProject(project)}>
                    <ProjectDetail project={project}>
                      {project.titre}
                    </ProjectDetail>
                  </TableCell>
                  <TableCell align="left">
                    <Actions project={project} />
                  </TableCell>
                  <TableCell align="left">{project.lieu}</TableCell>
                  <TableCell align="left">
                    {project.encadrants[0] ? project.encadrants[0].nom : ""}
                    {project.encadrants[1]
                      ? " / " + project.encadrants[1].nom
                      : ""}
                  </TableCell>
                  <TableCell align="left">{project.enc_ext || ""}</TableCell>
                </TableRow>
                <TableRow
                  key={project.id_sujet + "2"}
                  style={{
                    backgroundColor:
                      selectedRow === project.id_sujet
                        ? selectedRowColor
                        : "inherit",
                  }}
                  onClick={() => setSelectedRow(project.id_sujet)}
                >
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                  >
                    <Collapse
                      in={
                        selectedProject.indexOf(project.id_sujet) !== -1 ||
                        expandAll
                      }
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

const Actions = (props) => {
  const { project } = props;
  const current = useSelector((state) => state.users.current);
  const [dialog, openDialog] = useState(false);
  const [candidature, openCandidature] = useState(false);
  return (
    <>
      <AddCandidature
        open={candidature}
        closeCandidature={openCandidature}
        project={project}
      />

      <div style={{ display: "flex" }}>
        <CandidatButton project={project} iconButton />

        <MembreProjectActions project={project} iconButton />
        <PresidentProjectActions project={project} iconButton />
        {canViewAttachement(project) && (
          <Tooltip title="Contient des fichiers">
            <IconButton onClick={() => openDialog(true)} size="small">
              <Attachment />
            </IconButton>
          </Tooltip>
        )}
        {/* files dialog */}
        <Dialog
          open={dialog}
          onClose={() => openDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Attachement</DialogTitle>
          <DialogContent>
            <Typography paragraph>{project.titre}</Typography>
            <AttachedFiles fichiers={project.fichiers} />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={() => openDialog(false)}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};
