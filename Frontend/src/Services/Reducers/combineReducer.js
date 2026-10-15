import { combineReducers } from "redux";
import reducer from "./reducer";

const rootReducer = combineReducers({
    states : reducer
});

export default rootReducer;