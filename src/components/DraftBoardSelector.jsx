import SaveIcon from '@mui/icons-material/Save';
import saveDraftBoard from "../services/save-draftboard.js";

import {
    Accordion,
    AccordionDetails, 
    AccordionSummary,
    Box, 
    Button,
    FormControlLabel, 
    IconButton,
    MenuItem, 
    RadioGroup, 
    Radio, 
    TextField,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from "react";
import {useDraftBoard} from "./DraftBoardProvider";
import createDraftBoards from "../services/create-draftboard.js"; // Assuming you have a service
import {ADD_DRAFT_BOARD, UPDATE_BOARD_POSITIONS} from "../redux/draftBoardReducer"; // Assuming you have a reducer action
import getDraftBoards from "../services/get-draftboards.js"; // Assuming you have a service to fetch boards

const DraftBoardSelector = ({token}) => {


    const {dispatch, draftBoards, selectedDraftBoard, setSelectedDraftBoard} = useDraftBoard();
    const [loading, setLoading] = useState(false);
    const [newBoardName, setNewBoardName] = useState("");
    const [selectedSport, setSelectedSport] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!selectedDraftBoard._id) return;
        setSaving(true);
        try {
            // Get the current board from the reducer state
            const currentBoard = draftBoards.find(board => board._id === selectedDraftBoard._id);
            if (!currentBoard) {
                throw new Error("Could not find board in reducer state");
            }
            console.log("Saving draft board from reducer state:", currentBoard);
            await saveDraftBoard(token, currentBoard._id, currentBoard.sport, currentBoard);
        } catch (error) {
            console.error("Failed to save draft board:", error);
        } finally {
            setSaving(false);
        }
    };
    
    console.log("DraftBoardSelector component rendered with boards:", draftBoards);

    // Create new draft board
    const handleCreateBoard = (e) => {
        const createNewBoard = async () => {
            e.preventDefault();
            if (!newBoardName || !selectedSport) return;
            setLoading(true);
            try {
                await createDraftBoards(token, newBoardName, selectedSport);
                const resDraftBoards = await getDraftBoards(token);
                dispatch({ type: ADD_DRAFT_BOARD, payload: resDraftBoards });
                setNewBoardName("");
                setSelectedSport("");
            } catch (error) {
                console.error("Failed to create draft board:", error);
            } finally {
                setLoading(false);
            }
        };
        createNewBoard();
    };

    const NBA_POSITIONS = ["PG", "SG", "SF", "PF", "C"];
    const NFL_POSITIONS = ["QB", "RB", "WR", "TE", "K", "DEF"];

    const orderPositionsInRound = (round, sport) => {
        if (!round) return {};
        
        const orderedRound = {};
        const roundPositions = Object.keys(round);
        
        // Sort positions based on the sport's order
        const positionOrder = sport === 'nba' ? NBA_POSITIONS : NFL_POSITIONS;
        const orderedPositions = roundPositions.sort((a, b) => {
            const aIndex = positionOrder.indexOf(a);
            const bIndex = positionOrder.indexOf(b);
            // If position is not in the order array, put it at the end
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
        });
        
        // Reconstruct the round with ordered positions
        orderedPositions.forEach(pos => {
            orderedRound[pos] = round[pos];
        });
        
        return orderedRound;
    };

    const handleSelectBoard = (e) => {
        const selectedBoardId = e.target.value;
        const board = draftBoards.find(board => board._id === selectedBoardId);
        
        if (board) {
            // Create a new board object with ordered positions
            const orderedBoard = {
                ...board,
                rounds: Object.keys(board.rounds).reduce((acc, roundKey) => {
                    acc[roundKey] = orderPositionsInRound(board.rounds[roundKey], board.sport);
                    return acc;
                }, {})
            };
            
            // Update the board in the reducer state
            dispatch({
                type: UPDATE_BOARD_POSITIONS,
                payload: {
                    boardId: board._id,
                    orderedBoard
                }
            });
            
            setSelectedDraftBoard(orderedBoard);
        }
    };
    console.log("Selected Draft Board:", selectedDraftBoard.draftBoardName);



    return (
        <div>
            <Box id={`draft-board`} sx={{ mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        select
                        id="draftBoardSelect"
                        value={selectedDraftBoard.draftBoardName || ""}
                        onChange={handleSelectBoard}
                        sx={{ minWidth: 200 }}
                        textAlign="center"
                    >
                        <MenuItem key={`blank`} value="" disabled>Select...</MenuItem>
                        {draftBoards.map((board) => (
                            <MenuItem key={board._id} value={board._id} data-id={board._id}>
                                {board.draftBoardName} - {board.sport.toUpperCase()}
                            </MenuItem>
                        ))}
                    </TextField>
                    <IconButton 
                        onClick={handleSave}
                        disabled={!selectedDraftBoard._id || saving}
                        color="primary"
                        title="Save Draft Board"
                    >
                        <SaveIcon />
                    </IconButton>
                </Box>
            </Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Create New Draft Board
                </AccordionSummary>
                <AccordionDetails>
                    <Box component="form" onSubmit={handleCreateBoard} sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <TextField
                            type="text"
                            placeholder="New Draft Board Name"
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                            disabled={loading}
                            variant="outlined"
                            size="small"
                            sx={{ flex: 1 }}
                            id="newDraftBoardName"
                        />
                        <RadioGroup 
                            row 
                            value={selectedSport}
                            onChange={(e) => setSelectedSport(e.target.value)}
                        >
                            <FormControlLabel value="nfl" control={<Radio />} label="NFL" />
                            <FormControlLabel value="nba" control={<Radio />} label="NBA" />
                        </RadioGroup>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            disabled={loading || !newBoardName || !selectedSport}
                        >
                            {loading ? "Creating..." : "Create Draft Board"}
                        </Button>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
 export default DraftBoardSelector;