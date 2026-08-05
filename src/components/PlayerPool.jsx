import React, { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { 
    Accordion,
    AccordionDetails,  
    AccordionSummary, 
    Box, 
    FormControlLabel, 
    Radio,
    RadioGroup, 
    Typography 
} from "@mui/material";
import { useDraftBoard } from "./DraftBoardProvider";
import { SET_PLAYER_POOL_FILTER } from "../redux/draftBoardReducer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Position from "./Position";

const PlayerPool = React.memo(({round, roundKey}) => {
    const theme = useTheme();
    const roundName = 'Player Pool';
    const { selectedDraftBoard, dispatch } = useDraftBoard();
    const filterValue = selectedDraftBoard?.playerPoolFilter || 'adp';
    
    const positions = useMemo(() => {
        return round ? Object.keys(round) : [];
    }, [round]);

    const sortPlayers = (players, filter) => {
        if (!Array.isArray(players)) return [];
        return [...players].sort((a, b) => {
            if (filter === 'adp') {
                return (a.projectedStats?.adp || 999) - (b.projectedStats?.adp || 999);
            } else {
                return (b.prevYearStats?.points || 0) - (a.prevYearStats?.points || 0);
            }
        });
    };

    return (
        <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
            <Box>
                <Typography variant="h4" style={{ color: theme.palette.primary.main, textAlign: 'center', marginBottom: 10 }}>
                    {roundName}
                </Typography>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        filter
                    </AccordionSummary>
                    <AccordionDetails>
                        <RadioGroup 
                            row 
                            aria-label="filter-players" 
                            name="filter-players" 
                            value={filterValue}
                            onChange={(e) => dispatch({
                                type: 'SET_PLAYER_POOL_FILTER',
                                payload: {
                                    boardId: selectedDraftBoard._id,
                                    filter: e.target.value
                                }
                            })}
                        >
                            <FormControlLabel value="adp" control={<Radio />} label="ADP" />
                            <FormControlLabel value="points" control={<Radio />} label="Prev Year Points" />
                        </RadioGroup>
                    </AccordionDetails>
                </Accordion>
            </Box>
            
            <hr style={{ borderColor: theme.palette.primary.main, marginBottom: 20, height: 3, width: '100%' }} />
            <div style={{ display: 'flex', gap: 0, width: '100%' }}>
                {positions.map((positionKey) => (
                    <Position 
                        key={positionKey} 
                        position={sortPlayers(round?.[positionKey], filterValue)} 
                        positionKey={positionKey}
                        roundKey={roundKey}
                    />
                ))}
            </div>
        </div>
    );
});

export default PlayerPool;