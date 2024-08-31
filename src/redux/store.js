import { configureStore } from '@reduxjs/toolkit';
import playerPoolReducer from './player-pool.js';

export default configureStore({
    reducer: {
        playerPool: playerPoolReducer
    }
});