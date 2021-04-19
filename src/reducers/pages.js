const pagesReducer = (state = [], action) => {
    switch (action.type) {
      case "SET_PAGES":
        state = action.payload;
        return state;
      default:
        return state;
    }
  };
  
  export default pagesReducer;
  