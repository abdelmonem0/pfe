import { Project_States } from "../Constants";

const parametersReducer = (state = { all: [], Project_States }, action) => {
  switch (action.type) {
    case "SET_PARAMETERS":
      return { ...state, all: action.payload };
    default:
      return state;
  }
};

export default parametersReducer;
