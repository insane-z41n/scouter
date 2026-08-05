import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {Reorder} from "framer-motion";
import { Box, Container, Typography } from "@mui/material";
import Player from "./Player"; 

const Position = React.memo(({ position, positionKey, roundKey }) => {
    const theme = useTheme();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        setPlayers(Array.isArray(position) ? position : []);
    }, [position]);
    return (
        <Container style={{padding: 0}}>
            <Box sx={{ textAlign: "center", gap: 0 }}>
                <Typography variant="h5" style={{ color: theme.palette.primary.main }}>
                    {positionKey}
                </Typography>
            </Box> 
            <Box sx={{ textAlign: "center", gap: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Reorder.Group axis="y" values={players} onReorder={setPlayers} style={{listStyle: 'none', width: '100%', alignContent: 'center', padding: 0}}> 
                    {players.map((player) => (
                        <Reorder.Item key={player._id} value={player}>
                            <Player 
                                player={player} 
                                roundKey={roundKey}
                            />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </Box>
        </Container>
    );
});

export default Position;