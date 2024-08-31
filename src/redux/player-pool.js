import { current, createSlice } from "@reduxjs/toolkit";
import players from '../db/draft-db.json';

const playerPool = players['player-pool'];
const rounds = Object.keys(players)
    .filter(k => !['player-pool'].includes(k))
    .reduce((obj, k) => {
        obj[k] = players[k];
        return obj;
    }, {});

const isRoundEmpty = (roundPlayers) => {
    const positions = Object.keys(roundPlayers);
    positions.forEach(pos => {
        if(roundPlayers[pos].length !== 0) {
            return false;
        }
    });
    return true;
}

export const playerPoolReducer = createSlice({
    name: "playerPoolReducer",
    initialState: {
        playerPool: playerPool,
        rounds: rounds
    },
    reducers: {
        roundUpdate: (state, action) => {
            let player = action.payload.player;
            const position = player.positions[0];
            const currentRound = action.payload.currentRound;
            const selectedRound = (action.payload.selectedRound === "0") ?  'player-pool' : action.payload.selectedRound;

            console.log('Player: ', player);
            console.log('Position: ', position);
            console.log('Current Round: ', currentRound);
            console.log('Selected Round: ', selectedRound);
            
            let tempPlayer = {...player};
            tempPlayer.roundEval = (selectedRound === 'player-pool') ? 0 : selectedRound;
            if(selectedRound === 'player-pool') {
                state.playerPool[position].unshift(tempPlayer);
            }
            else {
                if(!state.rounds[selectedRound] || Object.keys(state.rounds[selectedRound]).length === 0) {
                    const newRoundObject = {[selectedRound]: {'QB': [], 'RB': [], 'WR': [], 'TE': [], 'DEF': [], 'K': []}};
                    Object.assign(state.rounds, newRoundObject);
                }
                state.rounds[selectedRound][position].push(tempPlayer);
            }
            
            if(currentRound === 'player-pool') {
                const index = state.playerPool[position].findIndex(p => p.playerId === player.playerId);
                state.playerPool[position].splice(index, 1);
            }
            else {
                const index = state.rounds[currentRound][position].findIndex(p => p.playerId === player.playerId);
                state.rounds[currentRound][position].splice(index, 1);
                if(isRoundEmpty(state.rounds[currentRound])){
                    delete state.rounds[currentRound];  
                } 
            }
            
        }
    }

});

export const {roundUpdate} = playerPoolReducer.actions;
export default playerPoolReducer.reducer;

