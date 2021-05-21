import React, { useState } from "react";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
} from "@material-ui/core";
import ProjectDetail from "../../../../Commun/ProjectDetail";
import {
  projectCheckBox,
  isProjectSel,
  selectAllProjects,
} from "../../SoutenanceLogic";

function TableView(props) {
  const { projects, selectedProjects, setSelectedProjects } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState("");

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

  return (
    <div className="table-container">
      {" "}
      <div>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProjects.length > 0}
                    indeterminate={
                      selectedProjects.length > 0 &&
                      selectedProjects.length < projects.length
                    }
                    onChange={() =>
                      selectAllProjects(
                        selectedProjects,
                        setSelectedProjects,
                        projects
                      )
                    }
                  />
                </TableCell>
                <TableCell>Projet</TableCell>
                <TableCell align="left">Encadrant</TableCell>
                <TableCell align="left">Affecté à</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.slice(sliceStart, sliceEnd).map((project, idx) => (
                <TableRow
                  key={project.id_sujet + "1"}
                  style={{
                    backgroundColor:
                      selectedRow === project.id_sujet
                        ? selectedRowColor
                        : "inherit",
                  }}
                  onClick={() => setSelectedRow(project.id_sujet)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isProjectSel(selectedProjects, project.id_sujet)}
                      onChange={() =>
                        projectCheckBox(
                          selectedProjects,
                          setSelectedProjects,
                          project.id_sujet
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <ProjectDetail project={project}>
                      {project.titre}
                    </ProjectDetail>
                  </TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">
                    {project.encadrants[0] ? project.encadrants[0].nom : ""}
                    {project.encadrants[1]
                      ? " / " + project.encadrants[1].nom
                      : ""}
                  </TableCell>
                </TableRow>
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
      </div>
    </div>
  );
}

export default TableView;
