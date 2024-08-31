import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Position from "./position-card";


const PlayerPool = () => {
    console.log('Loading Player Pool Card...');
    const {playerPool} = useSelector(state => state.playerPool);
    const positions = Object.keys(playerPool);
    let size = 12/positions.length;
    
    return(
        <Box className={`PlayerPool`} margin={2} sx={{minWidth: 1440}} borderTop={1}>
            <Typography variant='h3' sx={{justifyContent: 'flex-start'}} margin={2}>
                Player Pool
            </Typography>
            <Grid rowGap={1} container>
                {positions.map(pos => (
                    <Grid item xs={size} sm ={size} md={size} key={`grid-item-${pos}-player-pool`}>
                        <Position
                            positionGroup={pos}
                            currentRound={'player-pool'}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default PlayerPool;
