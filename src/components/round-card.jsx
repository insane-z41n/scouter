import { Box, Grid, Typography } from "@mui/material";
import Position from "./position-card";
import { useTheme } from "@emotion/react";

const RoundCard = props => {
    console.log('Loading Round Card...');
    const theme = useTheme();
    const {roundNumber, positions} = props
    let size = 12/positions.length;
    
    return(
        <Box className={`Round-${roundNumber}`} margin={2} sx={{minWidth: 1440}} borderTop={1} borderColor={theme.palette.primary.main}>
            <Typography variant='h3' sx={{justifyContent: 'flex-start'}} margin={2}>
                {`Round ${roundNumber}`}
            </Typography>
            <Grid rowGap={1} container>
                {positions.map(pos => (
                    <Grid item xs={size} sm ={size} md={size} key={`grid-item-${pos}-player-pool`}>
                        <Position
                            positionGroup={pos}
                            currentRound={roundNumber}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default RoundCard;
