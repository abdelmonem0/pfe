const values = {
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  maxCrenaux: 1,
  sales: "",
  selectedTeachers: [],
  selectedProjects: [],
  presidents: [],
};

const soutenanceReducer = (state = {}, action) => {
  switch (action.type) {
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
    case "RESET_VALUES":
      state = {
        ...state,
        values: values,
      };
      return state;
    case "PURGE":
      state = {};
      return state;
    default:
      return state;
  }
};

export default soutenanceReducer;
