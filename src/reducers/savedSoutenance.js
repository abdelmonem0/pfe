const values = {
  maxCrenaux: 1,
  sales: "",
  selectedTeachers: [],
  selectedProjects: [],
  presidents: [],
};

const savedSoutenanceReducer = (state = {}, action) => {
  const target = action.payload;

  switch (action.type) {
    case "SET_ALL_SAVED_SOUTENANCES":
      state = { ...state, ...action.payload };
      console.log(action.payload);
      return state;
    case "SET_SAVED_VALUES":
      state = { ...state, values: action.payload };
      return state;
    case "SET_SAVED_SOUTENANCES":
      state = { ...state, soutenances: action.payload };
      return state;
    case "UPDATE_SAVED_SOUTENANCE":
      var soutenances = [...state.soutenances];
      for (let i = 0; i < soutenances.length; i++)
        if (soutenances[i].id_soutenance === target.id_soutenance) {
          soutenances[i] = target;
          state = { ...state, soutenances: soutenances };
          return state;
        }
      return state;
    case "UPDATE_SAVED_TEACHER":
      var teachers = [...state.teachers];
      for (let i = 0; i < teachers.length; i++)
        if (teachers[i].id_utilisateur === target.id_utilisateur) {
          teachers[i] = target;
          state = { ...state, teachers: teachers };
          return state;
        }
      return state;
    case "DELETE_SAVED_SOUTENANCE":
      const ss = state.soutenances.filter(
        (s) => action.payload.indexOf(s.id_soutenance) < 0
      );
      return { ...state, soutenances: ss };
    case "ADD_SAVED_SOUTENANCE":
      return { ...state, soutenances: [...state.soutenances, action.payload] };
    case "RESET_SAVED_VALUES":
      state = {
        ...state,
        values: values,
        soutenances: [],
      };
      return state;
    case "PURGE":
      return [];
    default:
      return state;
  }
};

export default savedSoutenanceReducer;
