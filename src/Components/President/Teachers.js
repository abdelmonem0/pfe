import {
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
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
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendReminderForTeachersNotifications } from "../../Notifications";
import { assignTagsToTeachers } from "./Soutenances/Data";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Teachers(props) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  var teachers = users.all.filter((user) => user.role === "enseignant");
  const tags = useSelector((state) => state.tags);
  const [showTags, setShowTags] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const classes = useRowStyles();

  const sliceStart =
    page * rowsPerPage < teachers.length ? page * rowsPerPage : 0;
  const sliceEnd =
    page * rowsPerPage + rowsPerPage < teachers.length
      ? page * rowsPerPage + rowsPerPage
      : teachers.length;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectTeacher = (id) => {
    if (selectedTeachers.indexOf(id) === -1) {
      setSelectedTeachers([...selectedTeachers, id]);
    } else {
      setSelectedTeachers(selectedTeachers.filter((st) => st !== id));
    }
  };

  const handleSelectAllTeachers = () => {
    if (selectedTeachers.length === teachers.length) {
      setSelectedTeachers([]);
      return;
    }
    var selected = [];
    for (let teacher of teachers) selected.push(teacher.id_utilisateur);

    setSelectedTeachers(selected);
  };

  teachers = assignTagsToTeachers(teachers, tags);

  function notify(isForTags) {
    sendReminderForTeachersNotifications(
      users.current,
      selectedTeachers,
      isForTags
    )
      .then(() => {
        var message = isForTags
          ? "Notifications pour spécialités envoyés"
          : "Notifications pour dates envoyés";
        dispatch({
          type: "OPEN_SNACK",
          payload: { open: true, message, type: "success" },
        });
      })
      .catch((err) => console.error(err));
  }

  return (
    <Paper style={{ flex: "1" }} elevation={0}>
      <TableContainer component={Paper}>
        <TableToolbar
          notify={notify}
          selected={selectedTeachers}
          setShowTags={setShowTags}
          showTags={showTags}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedTeachers.length > 0 &&
                    selectedTeachers.length < teachers.length
                  }
                  checked={
                    teachers.length > 0 &&
                    selectedTeachers.length === teachers.length
                  }
                  onChange={() => handleSelectAllTeachers()}
                />
              </TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell># spécialités</TableCell>
              <TableCell>email</TableCell>
              <TableCell>Préférances</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.slice(sliceStart, sliceEnd).map((teacher) => (
              <React.Fragment>
                <TableRow
                  className={classes.root}
                  role="checkbox"
                  onClick={() => handleSelectTeacher(teacher.id_utilisateur)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={
                        selectedTeachers.indexOf(teacher.id_utilisateur) > -1
                      }
                    />
                  </TableCell>
                  <TableCell>{teacher.nom}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{teacher.tags.length}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                  >
                    <Collapse in={showTags}>
                      <div
                        style={{
                          paddingBottom: "1rem",
                          display: "flex",
                          gap: "0.5rem",
                        }}
                      >
                        {teacher.tags.map((tag) => (
                          <Chip
                            variant="outlined"
                            size="small"
                            label={tag.id_tag}
                          />
                        ))}
                      </div>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[8, 15, 20, 50]}
        component="div"
        count={teachers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default Teachers;

const TableToolbar = (props) => {
  const { selected, setShowTags, showTags, notify } = props;

  return selected.length === 0 ? (
    <div
      style={{
        padding: "1rem 0.5rem",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography variant="h5">Liste des enseignants</Typography>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Checkbox onChange={() => setShowTags(!showTags)} selected={showTags} />
      </div>
      <Typography>Afficher les spécialités</Typography>
    </div>
  ) : (
    <div
      style={{
        padding: "1rem 0.5rem",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "pink",
      }}
    >
      <Typography variant="h5">Séléctionnés {selected.length}</Typography>
      <Button
        variant="outlined"
        style={{ textTransform: "none" }}
        onClick={() => notify(true)}
      >
        Notifier pour ajouter des Tags
      </Button>
      <Button
        variant="outlined"
        style={{ textTransform: "none" }}
        onClick={() => notify(false)}
      >
        Notifier pour ajouter des Préférences
      </Button>
      <Typography variant="h6">Grade </Typography>
    </div>
  );
};
