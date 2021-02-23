type actionType = { 
  type: any 
  payload: never 
};

export default (state = [], action: actionType) => {

    switch (action.type) {
  
      case 'STORE_ALL_LAYERS': {
      
        return Object.assign([], action.payload);
      }
  
      case 'ADD_MAP_LAYER': {
  
        return Object.assign([], [...state, action.payload]);
      }
  
      case 'REMOVE_MAP_LAYER': {
  
        state.forEach((item, index, object) => {
  
          if (item === action.payload) {
  
             object.splice(index, 1);
          }  
        });
        return Object.assign([], state, state);
      }
  
      default:
        return state
    }
};
