const values = {
  maxCrenaux: 1,
  sales: "",
  selectedTeachers: [],
  selectedProjects: [],
  presidents: [],
};

const soutenanceReducer = (state = {}, action) => {
  const target = action.payload;

  switch (action.type) {
    case "SET_ALL_SOUTENANCES":
      state = {
        ...state,
        ...action.payload,
      };
      return state;
    case "SET_SOUTENANCE_PROJECTS":
      state = { ...state, projects: action.payload };
      return state;
    case "SET_TEACHERS_DATES":
      state = { ...state, dates: action.payload };
      return state;
    case "SET_TEACHERS_TAGS":
      state = { ...state, tags: action.payload };
      return state;
    case "SET_TEACHERS":
      state = { ...state, teachers: action.payload };
      return state;
    case "SET_VALUES":
      state = { ...state, values };
      return state;
    case "UPDATE_VALUES":
      state = {
        ...state,
        values: {
          ...state.values,
          [action.payload.prop]: action.payload.value,
        },
      };
      return state;
    case "SET_SOUTENANCES":
      state = { ...state, soutenances: action.payload };
      return state;
    case "UPDATE_SOUTENANCE":
      var soutenances = [...state.soutenances];
      for (let i = 0; i < soutenances.length; i++)
        if (soutenances[i].id_soutenance === target.id_soutenance) {
          soutenances[i] = target;
          state = { ...state, soutenances: soutenances };
          return state;
        }
      return state;
    case "UPDATE_TEACHER":
      var teachers = [...state.teachers];
      for (let i = 0; i < teachers.length; i++)
        if (teachers[i].id_utilisateur === target.id_utilisateur) {
          teachers[i] = target;
          state = { ...state, teachers: teachers };
          return state;
        }
      return state;
    case "DELETE_SOUTENANCE":
      const ss = state.soutenances.filter(
        (s) => action.payload.indexOf(s.id_soutenance) < 0
      );
      return { ...state, soutenances: ss };
    case "ADD_SOUTENANCE":
      return { ...state, soutenances: [...state.soutenances, action.payload] };
    case "RESET_VALUES":
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

export default soutenanceReducer;
