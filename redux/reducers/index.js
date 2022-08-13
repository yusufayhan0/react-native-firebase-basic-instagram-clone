import { combineReducers } from "redux"
import { userReducer } from "./userReducer"
import { usersReducer } from "./usersReducer"



const Reducers = combineReducers({
    userState: userReducer,
    usersState: usersReducer
})


export default Reducers