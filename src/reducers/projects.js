const projectsReducer = (
  state = { dataArray: [], proposed: [], self: [] },
  action
) => {
  switch (action.type) {
    case "SET_PROJECTS":
      state = { ...state, dataArray: action.payload };
      return state;
    case "SET_PROPOSED_PROJECTS":
      state = { ...state, proposed: action.payload };
      return state;
    case "SET_SELF_PROJECTS":
      state = { ...state, self: action.payload };
      return state;
    case "SET_CAHIER":
      var projects = [...state.dataArray];
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id_sujet === action.payload.attache_a) {
          projects[i] = {
            ...projects[i],
            fichiers: [...projects[i].fichiers, action.payload],
          };
          console.log(projects[i].fichiers);
        }
      }
      state = { ...state, dataArray: projects };
      return state;
    case "UPDATE_CAHIER":
      var projects = [...state.dataArray];
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id_sujet === action.payload.attache_a) {
          var fichiers = projects[i].fichiers;
          for (var j = 0; j < fichiers.length; j++)
            if (fichiers[j].id_fichier === action.payload.id_fichier) {
              fichiers[j].type = action.payload.type;
              projects[i] = {
                ...projects[i],
                fichiers: fichiers,
              };
            }

          console.log(projects[i].fichiers);
        }
      }
      state = { ...state, dataArray: projects };
      return state;
    case "DELETE_FILE":
      var projects = [...state.dataArray];
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id_sujet === action.payload.attache_a) {
          projects[i] = {
            ...projects[i],
            fichiers: [
              ...projects[i].fichiers.filter(
                (file) => file.id_fichier !== action.payload.id_fichier
              ),
            ],
          };
          console.log(projects[i].fichiers);
        }
      }
      state = { ...state, dataArray: projects };
      return state;
    case "PURGE":
      state = { dataArray: [] };
      return state;
    default:
      return state;
  }
};

export default projectsReducer;
