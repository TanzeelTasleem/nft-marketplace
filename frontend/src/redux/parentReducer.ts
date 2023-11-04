import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/redux/slices/authSlice';

const parentReducer = combineReducers({
    auth: authReducer,
})

export default parentReducer;