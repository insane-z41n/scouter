import { createSlice, current } from "@reduxjs/toolkit";
import { getDraftBoard } from "../services/scouter-get-draftboard.js";

const draftBoard = await getDraftBoard('draft_board_nfl', 'nfl'); // Replace with actual scouterId and sport
console.log(draftBoard);
const playerPool = draftBoard.rounds['player-pool'];
const rounds = Object.keys(draftBoard.rounds)
    .filter(k => !['player-pool'].includes(k))
    .reduce((obj, k) => {
        obj[k] = draftBoard.rounds[k];
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
    const position = player.position;
    console.log(`Adding player to Round ${selectedRound}`);
    console.log(JSON.parse(JSON.stringify(state)));
    
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
            const newRoundObject = {[selectedRound]: {'PG': [], 'SG': [], 'SF': [], 'PF': [], 'C': []}};
            Object.assign(state.rounds, newRoundObject);
        }
        // Ensure position array exists
        if (!Array.isArray(state.rounds[selectedRound][position])) {
            state.rounds[selectedRound][position] = [];
        }
        // Add player to the beginning of the round. 
        let playersInPosition = [...state.rounds[selectedRound][position]];
        playersInPosition.unshift(player);
        state.rounds[selectedRound][position] = playersInPosition;
    }
}

const removePlayerFromCurrentRound = (state, action) => {
    const player = {...action.payload.player};
    const currentRound = (action.payload.currentRound === "0") ?  'player-pool' : action.payload.currentRound;
    const position = player.position;
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
            const position = player.position;
            const currentRound = action.payload.currentRound;
            const selectedRound = (action.payload.selectedRound === "0") ?  'player-pool' : action.payload.selectedRound;

            console.log('Player: ', player);
            console.log('Position: ', position);
            console.log('Current Round: ', currentRound);
            console.log('Selected Round: ', selectedRound);
            
            // add player to selected round
            removePlayerFromCurrentRound(state, action);
            addPlayerToSelectedRound(state, action);
        },
        saveDraft: (state, action) => {
            console.log("Save State: ", current(state));
        },
        REORDER_PLAYERS_IN_POSITION: (state, action) => {
            const { positionGroup, currentRound, newOrder } = action.payload;
            if(currentRound === 'player-pool') {
                state.playerPool[positionGroup] = newOrder;
            } else {
                state.rounds[currentRound][positionGroup] = newOrder;
            }
        }
    }

});

export const {roundUpdate, saveDraft, REORDER_PLAYERS_IN_POSITION} = playerPoolReducer.actions;
export default playerPoolReducer.reducer;

