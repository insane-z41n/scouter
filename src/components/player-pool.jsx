import { Box, Grid, Typography } from "@mui/material";
import { connect } from "react-redux";
import Position from "./position-card";
import { useTheme } from "@emotion/react";


const PlayerPool = props => {
    console.log('Loading Player Pool Card...');
    const theme = useTheme();
    const {playerPool} = props;
    const positions = Object.keys(playerPool);
    let size = 12/positions.length;
    
    return(
        <Box className={`PlayerPool`} margin={2} sx={{minWidth: 1440, background: theme.palette.background, borderColor: theme.palette.primary.main}} borderTop={1}>
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

const mapStateToProps = (state) => {
    const {playerPool} = state.playerPool;
    return {
        playerPool
    }
}

export default connect(mapStateToProps)(PlayerPool);
