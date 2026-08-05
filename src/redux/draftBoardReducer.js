export const MOVE_PLAYER_TO_ROUND = "MOVE_PLAYER_TO_ROUND";
export const ADD_DRAFT_BOARD = "ADD_DRAFT_BOARD";
export const SET_SELECTED_DRAFT_BOARD = "SET_SELECTED_DRAFT_BOARD";
export const SET_DRAFT_BOARDS = "SET_DRAFT_BOARDS";
export const UPDATE_BOARD_POSITIONS = "UPDATE_BOARD_POSITIONS";
export const SET_PLAYER_POOL_FILTER = "SET_PLAYER_POOL_FILTER";

// Helper to deep clone board object
const cloneBoard = (board) => {
    return JSON.parse(JSON.stringify(board));
}

export const draftBoardReducer = (state, action) => {
    switch (action.type) {
        case MOVE_PLAYER_TO_ROUND: {
            const { draftboard, player, fromRound, toRound } = action.payload;
            
            // Find the current draftboard in state
            const updatedState = state.map(board => {
                if (board._id !== draftboard._id) return board;
                
                // Clone the board to avoid mutating state directly
                const newBoard = cloneBoard(board);
                // Make sure rounds structure exists
                if (!newBoard.rounds) newBoard.rounds = {};
                const position = player.position;
                
                // Create a copy of the current state for both rounds
                const positions = Object.keys(newBoard.rounds[fromRound] || {})

                
                if (!newBoard.rounds[fromRound]) {
                    newBoard.rounds[fromRound] = {};
                    positions.forEach(pos => newBoard.rounds[fromRound][pos] = []);
                }
                if (!newBoard.rounds[toRound]) {
                    newBoard.rounds[toRound] = {};
                    positions.forEach(pos => newBoard.rounds[toRound][pos] = []);
                }
                
                // Ensure position arrays exist (in case they were somehow removed)
                if (!newBoard.rounds[fromRound][position]) newBoard.rounds[fromRound][position] = [];
                if (!newBoard.rounds[toRound][position]) newBoard.rounds[toRound][position] = [];
                
                // Remove player from source round's position group
                newBoard.rounds[fromRound][position] = newBoard.rounds[fromRound][position]
                    .filter(p => p._id !== player._id);
                
                // Add player to target round's position group
                // If moving to player pool and player is drafted, add to end of array
                // If moving to player pool and player is not drafted, add to start of array
                // Otherwise add to end of array
                if (toRound === 'player-pool') {
                    const existingPlayers = newBoard.rounds[toRound][position];
                    if (player.drafted) {
                        newBoard.rounds[toRound][position] = [...existingPlayers, player];
                    } else {
                        // Find the index of the first drafted player
                        const firstDraftedIndex = existingPlayers.findIndex(p => p.drafted);
                        if (firstDraftedIndex === -1) {
                            // No drafted players, add to end
                            newBoard.rounds[toRound][position] = [...existingPlayers, player];
                        } else {
                            // Insert before first drafted player
                            newBoard.rounds[toRound][position] = [
                                ...existingPlayers.slice(0, firstDraftedIndex),
                                player,
                                ...existingPlayers.slice(firstDraftedIndex)
                            ];
                        }
                    }
                } else {
                    newBoard.rounds[toRound][position] = [...newBoard.rounds[toRound][position], player];
                }

                // Check if the source round is empty (all positions have no players)
                // Don't remove the player pool
                if (fromRound !== 'player-pool') {
                    const isRoundEmpty = Object.values(newBoard.rounds[fromRound]).every(
                        positionArray => positionArray.length === 0
                    );
                    if (isRoundEmpty) {
                        delete newBoard.rounds[fromRound];
                    }
                }
                
                return newBoard;
            });
            
            return updatedState;
        }
        case ADD_DRAFT_BOARD: {
            const newBoards = Array.isArray(action.payload) ? action.payload : [action.payload];
            
            // Filter out boards that already exist
            const uniqueBoards = newBoards.filter(newBoard => 
                !state.some(board => board._id === newBoard._id)
            );
            
            if (uniqueBoards.length === 0) {
                console.warn("No new draft boards to add");
                return state;
            }
            
            return [...state, ...uniqueBoards];
        }
        case SET_DRAFT_BOARDS: {
            const draftBoards = action.payload;
            return [...draftBoards];
        }

        case UPDATE_BOARD_POSITIONS: {
            const { boardId, orderedBoard } = action.payload;
            const updatedState = state.map(board => 
                board._id === boardId ? orderedBoard : board
            );
            return updatedState;
        }

        case SET_PLAYER_POOL_FILTER: {
            const { boardId, filter } = action.payload;
            const updatedState = state.map(board => {
                if (board._id !== boardId) return board;
                return {
                    ...board,
                    playerPoolFilter: filter
                };
            });
            return updatedState;
        }
        
        default:
            return state;
    }
};