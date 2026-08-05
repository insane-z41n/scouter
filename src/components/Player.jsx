import { useTheme } from "@mui/material/styles";
import { Box, TextField, Typography, MenuItem, Checkbox, FormGroup, FormControlLabel} from "@mui/material";
import { MOVE_PLAYER_TO_ROUND } from "../redux/draftBoardReducer";
import { useDraftBoard } from "./DraftBoardProvider";
import React, { useCallback } from 'react';

// Move rounds array outside component to prevent recreation
const ROUNDS = ['Player Pool', 'Drafted', ...Array.from({ length: 10 }, (_, i) => `Round ${i + 1}`)];

const Player = React.memo(({player, roundKey}) => {
    const {dispatch, selectedDraftBoard} = useDraftBoard();
    const theme = useTheme();

    const handleRoundChange = useCallback((e) => {
        const toRoundKey = e.target.value === 'Player Pool' ? 'player-pool' : e.target.value.replace('Round ', '');
        dispatch({
            type: MOVE_PLAYER_TO_ROUND,
            payload: {
                draftboard: selectedDraftBoard,
                player: player,
                fromRound: roundKey,
                toRound: toRoundKey
            }
        });
    }, [dispatch, selectedDraftBoard, player, roundKey]);

    const handleDraftedChange = useCallback((e) => {
        const isDrafted = e.target.checked;
        dispatch({
            type: MOVE_PLAYER_TO_ROUND,
            payload: {
                draftboard: selectedDraftBoard,
                player: { ...player, drafted: isDrafted },
                fromRound: roundKey,
                toRound: isDrafted ? 'drafted' : 'player-pool'
            }
        });
    }, [dispatch, selectedDraftBoard, player, roundKey]);

    const currentRoundValue = 
        roundKey === 'player-pool' ? 'Player Pool' : 
        roundKey === 'drafted' ? 'Drafted' :
        `Round ${roundKey}`;

    return (
        <div style={{ marginBottom: 0 }}>
            <Box sx={{
                textAlign: "center",
                border: `1px solid ${theme.palette.divider}`,
                padding: 0,
                borderRadius: 0,
                width: { xs: '90%', sm: 150, md: '100%' },
                height: { xs: 100, sm: 120, md: 200 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto"
            }}> 
                <Typography
                    variant="subtitle2"
                    style={{ 
                        color: theme.palette.text.secondary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                        textAlign: "left",
                        padding: "4px 8px"
                    }}
                >
                    {player.fantasyPositions.join(" | ")}
                </Typography>
                <TextField
                    select
                    id={`${player._id}-${roundKey}-select`}
                    value={currentRoundValue}
                    onChange={handleRoundChange}
                    size="small"
                >
                    <MenuItem value="Player Pool">Player Pool</MenuItem>
                    {ROUNDS.slice(1).map((round) => (
                        <MenuItem key={round} value={round}>
                            {round}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography 
                    variant="body1"
                    style={{ 
                        color: theme.palette.text.primary, 
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        whiteSpace: "nowrap", 
                        width: "100%",
                        textAlign: "center",
                        padding: "4px 8px",
                        textDecoration: player.drafted ? 'line-through' : 'none',
                        opacity: player.drafted ? 0.6 : 1
                    }}
                >
                    {player.name || player.team} - {player.team}
                </Typography>
                <Box>
                    <Typography 
                        variant="body2"
                        style={{ 
                            color: theme.palette.primary.main, 
                            overflow: "hidden", 
                            textOverflow: "ellipsis", 
                            whiteSpace: "nowrap", 
                            width: "100%",
                            textAlign: "center",
                            padding: "0 8px"
                        }}
                    >
                        {player.prevYearStats.year}: {player.prevYearStats.points} PTS
                    </Typography>
                    <Typography 
                        variant="body2"
                        style={{ 
                            color: theme.palette.primary.main, 
                            overflow: "hidden", 
                            textOverflow: "ellipsis", 
                            whiteSpace: "nowrap", 
                            width: "100%",
                            textAlign: "center",
                            padding: "0 8px"
                        }}
                    >
                        ADP: {player.projectedStats.adp}
                    </Typography>
                </Box>
                <Box sx={{ justifyContent: 'right', alignItems: 'right'}}>
                    <FormGroup>
                        <FormControlLabel 
                            control={
                                <Checkbox 
                                    checked={player.drafted || false}
                                    onChange={handleDraftedChange}
                                />
                            } 
                            label="Drafted"
                        />
                    </FormGroup>
                </Box>
            </Box>
        </div>
    );
});

export default Player;