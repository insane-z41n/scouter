import { Card, CardContent, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Select, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { roundUpdate } from '../redux/player-pool';
import { useTheme } from '@emotion/react';

const getPositionsFormatted = (player) => {
    let positions = "";
    player.fantasyPositions.forEach(pos => {
        positions+=`${pos} \n`;
    })
    return positions = positions.substring(0, positions.length-2);
};
const PlayerCard = props => { 
    const theme = useTheme();
    const dispatch = useDispatch();
    const {player, currentRound, getPlayers, setPlayers} = props;
    
    const onDraftedChange = (event) => {
        const isDrafted = event.target.checked;
        const index = getPlayers.indexOf(player);

        if(isDrafted) {
            // Send player to the bottom of the list
            let tempPlayers = [...getPlayers];
            tempPlayers.push(tempPlayers.splice(index, 1)[0]);
            setPlayers(tempPlayers);
        }
        else {
            // Send player to the top of the list
            let tempPlayers = [...getPlayers];
            tempPlayers.unshift(tempPlayers.splice(index, 1)[0]);
            setPlayers(tempPlayers);
        }

    };
    const roundOptions = [0, ...Array.from({length:15},(v,k)=>k+1)];
    

    return (
        <Card sx={{minHeight: 300, maxBlockSize: 300, minWidth: 210, border: 2, borderColor: theme.palette.secondary.main}}>
            <CardContent sx={{minHeight: 300, maxBlockSize: 300, minWidth: 210}}>
                <Grid container>   
                    <Grid sx={{justifyContent: 'space-between'}} container>
                        <Grid item sx={{maxWidth:20}}>
                            <Typography sx={{fontFamily: 'Monospace', fontSize: 12 }} align='left'>
                                {getPositionsFormatted(player)}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Select
                                variant='outlined'
                                id={`outlined-round-selections-${player.playerId}`}
                                value={roundOptions.includes(player.roundEval) ? player.roundEval : 0}
                                size="small"
                                key={`select-round-field-${player.playerId}`}
                                onChange={(e) => dispatch(roundUpdate({player, currentRound, selectedRound: `${e.target.value}`}))}
                                sx={{borderColor: theme.palette.primary.main, border: 1}}
                                >
                                {roundOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {(option === 0) ? 'Player Pool' : 'Round ' + option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        {/*Ranking Information*/}
                        <Grid item>
                            <Typography variant="stat_info" fontSize={12} align='right'>
                                ADP
                            </Typography>   
                            <Typography fontSize={12} align ='center'>
                                {player.projectedStats.adp}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container >
                        {/*Player Information*/}
                        <Grid sm={12} paddingTop={3} paddingBottom={3} item>
                            <Typography sx={{fontWeight: 'bold'}} align='center'>
                                {(player.name) ? player.name : player.team} 
                            </Typography>
                        </Grid>
                        
                        {/*Player Stats*/}
                        <Grid container paddingBottom={1.5} alignItems="baseline">
                            <Grid sm={6} item>
                                <Typography sx={{fontSize: 12}} align='left'>
                                    Projected: 
                                </Typography>
                                <Typography align='left'>
                                    {player.projectedStats.points} pts
                                </Typography>
                            </Grid>
                            <Grid sm={6} item>
                                <Typography align='right'  sx={{fontSize: 12}}>
                                    {(player.name) ? 'Depth: ' : ' - '}
                                </Typography>
                                <Typography align='right'>
                                    {player.depthChart}
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        <Grid paddingTop={1.5} sx={{borderTop: 1, borderColor: theme.palette.primary.main}} container>
                            <Grid sm={6} item>
                                <Typography sx={{display:'flex', fontSize:12}}>
                                    {player.prevYearStats.year}:
                                </Typography>
                                <Typography sx={{display: 'flex'}}>
                                    {(player.prevYearStats.points === '-') ? 0 : player.prevYearStats.points} pts
                                </Typography>
                                <Typography sx={{display: 'flex'}}>
                                    {(player.prevYearStats.gamesPlayed === '-') ? 0 : player.prevYearStats.gamesPlayed} GP
                                </Typography>
                            </Grid>

                            <Grid sm={6} item>
                                <Grid sm={12} item>
                                    <Typography align='right'>
                                        {(player.name) ? player.team : ' - '}
                                    </Typography>
                                </Grid>
                                <Grid sm={12} alignItems={'flex-end'} item>
                                    <FormControl>
                                        <FormControlLabel 
                                            control={
                                                <Checkbox/>
                                            }
                                            label='Drafted'
                                            labelPlacement='start'
                                            onChange={onDraftedChange}
                                            name={player.playerId}
                                            key={`checkbox-${player.playerId}`}
                                        />

                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default PlayerCard;