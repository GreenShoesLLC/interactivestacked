import { combineReducers } from 'redux';

// reducer import
import resourceReducer from './resourceReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    resource: resourceReducer
});

export default reducer;
