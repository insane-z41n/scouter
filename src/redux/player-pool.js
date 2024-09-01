import { createSlice } from "@reduxjs/toolkit";
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
    let isRoundEmpty = true;
    positions.forEach(pos => {
        if(roundPlayers[pos].length > 0) {
            isRoundEmpty = false;
        }
    });
    return isRoundEmpty;
}

const addPlayerToSelectedRound = (state, action) => {
    let player = {...action.payload.player};
    const selectedRound = (action.payload.selectedRound === "0") ?  'player-pool' : action.payload.selectedRound;
    const position = player.positions[0];
    console.log(`Adding player to Round ${selectedRound}`);
    
    // Change players round evaluation.
    player.roundEval = (selectedRound === 'player-pool') ? 0 : selectedRound;
    
    if(selectedRound === 'player-pool') {
        // Add player beginning of player pool. 
        let playersInPosition = [...state.playerPool[position]];
        playersInPosition.unshift(player);
        state.playerPool[position] = playersInPosition;
    }
    else {
        // Add round to rounds object
        if(!state.rounds[selectedRound] || Object.keys(state.rounds[selectedRound]).length === 0) {
            const newRoundObject = {[selectedRound]: {'QB': [], 'RB': [], 'WR': [], 'TE': [], 'DEF': [], 'K': []}};
            Object.assign(state.rounds, newRoundObject);
        }
        // Add player to the beginning of the round. 
        let playersInPosition = [...state.rounds[selectedRound][position]];;
        playersInPosition.unshift(player);
        state.rounds[selectedRound][position] = playersInPosition;
    }
}

const removePlayerFromCurrentRound = (state, action) => {
    const player = {...action.payload.player};
    const currentRound = (action.payload.currentRound === "0") ?  'player-pool' : action.payload.currentRound;
    const position = player.positions[0];
    console.log(`Removing player from Round ${currentRound}`);

    // remove player from current player pool
    if(currentRound === 'player-pool') {
        let playersInPosition = [...state.playerPool[position]];
        const index = playersInPosition.findIndex(p => p.playerId === player.playerId);
        playersInPosition.splice(index, 1);
        state.playerPool[position] = playersInPosition;

    }
    // remove player from current round
    else {
        let playersInPosition = [...state.rounds[currentRound][position]];
        const index = state.rounds[currentRound][position].findIndex(p => p.playerId === player.playerId);
        playersInPosition.splice(index, 1);
        state.rounds[currentRound][position] = playersInPosition;
        if(isRoundEmpty(state.rounds[currentRound])){
            delete state.rounds[currentRound];
            return;
        }
    }
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
            
            // add player to selected round
            removePlayerFromCurrentRound(state, action);
            addPlayerToSelectedRound(state, action);
        }
    }

});

export const {roundUpdate} = playerPoolReducer.actions;
export default playerPoolReducer.reducer;

