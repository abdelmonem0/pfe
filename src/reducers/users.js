const usersReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_USERS":
      state = { ...state, all: action.payload };
      return state;
    case "SET_CURRENT_USER":
      state = {
        ...state,
        current: action.payload,
        firstRole: action.payload.role,
      };
      return state;
    case "SWITCH_ROLE":
      state = {
        ...state,
        current: {
          ...state.current,
          role:
            state.current.role !== "enseignant"
              ? "enseignant"
              : state.firstRole,
        },
      };
      return state;
    case "PURGE":
      state = {};
      return state;
    default:
      return state;
  }
};

export default usersReducer;
