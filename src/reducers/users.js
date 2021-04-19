const usersReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_USERS":
      state = { ...state, all: action.payload };
      return state;
    case "SET_CURRENT_USER":
      state = { ...state, current: action.payload };
      return state;
    case "PURGE":
      state = {};
      return state;
    default:
      return state;
  }
};

export default usersReducer;
