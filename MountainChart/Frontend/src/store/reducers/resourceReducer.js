
// action - state management
import {
  SET_DISPLAY_RESOURCE,
  POST_ERROR
} from 'store/type';

export const initialState = {
  total: [],
  isLoading: true,
  error: {}
};

// ==============================|| RESOURCE REDUCER ||============================== //

const resourceReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
      case SET_DISPLAY_RESOURCE:
          return {
              ...state,
              total: payload,
              loading: false,
          };
      case POST_ERROR:
          return {
              ...state,
              error: payload,
              loading: false,
          };
      default:
          return state;
  }
};

export default resourceReducer;
