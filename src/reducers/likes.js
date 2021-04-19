const likesReducer = (state = [], action) => {
    switch (action.type) {
      case "SET_LIKES":
        state = action.payload;
        return state;
      default:
        return state;
    }
  };
  
  export default likesReducer;
  