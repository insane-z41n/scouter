
import { Card, CardContent, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { roundUpdate } from '../redux/player-pool';
const getPositionsFormatted = (player) => {
    let positions = "";
    player.positions.forEach(pos => {
        positions+=`${pos} | `;
    })
    return positions = positions.substring(0, positions.length-2);
};
const PlayerCard = props => { 
    const dispatch = useDispatch();
    const {player, currentRound, getPlayers, setPlayers} = props;
    
    // console.log(`Loading Player Card ${player.full_name}...`);
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
        <Card sx={{minHeight: 300, maxBlockSize: 300, minWidth: 210, border:2}}>
            <CardContent sx={{minHeight: 300, maxBlockSize: 300, minWidth: 210}}>
                <Grid container>   

                    <Grid sx={{justifyContent: 'space-between'}} container>
                        <Grid item>
                            <Typography sx={{fontFamily: 'Monospace'}} align='left'>
                                {getPositionsFormatted(player)}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                id={`outlined-round-selections-${player.playerId}`}
                                select
                                label="Select"
                                defaultValue={player.roundEval}
                                helperText="Round"
                                size="small"
                                name={`${player.playerId}`}
                                key={`select-round-field-${player.playerId}`}
                                onChange={(e) => dispatch(roundUpdate({player, currentRound, selectedRound: `${e.target.value}`}))}
                                >
                                {roundOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item>
                            <Typography fontSize={12} align='right'>
                                Rank
                            </Typography>   
                            <Typography fontSize={12} align ='center'>
                                {player.prevYearStats.ranking}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container >
                        <Grid sm={12} paddingTop={3} paddingBottom={3} item>
                            <Typography sx={{fontWeight: 'bold'}} align='center'>
                                {(player.full_name) ? player.full_name : player.team} 
                            </Typography>
                        </Grid>

                        <Grid container paddingBottom={1.5} alignItems="baseline">
                            <Grid sm={6} item>
                                <Typography sx={{fontSize: 12}} align='left'>
                                    Projected: 
                                </Typography>
                                <Typography align='left'>
                                    {player.projectedStats.pointsHalfPpr} pts
                                </Typography>
                            </Grid>
                            <Grid sm={6} item>
                                <Typography align='right'  sx={{fontSize: 12}}>
                                    {(player.full_name) ? 'Depth: ' : ' - '}
                                </Typography>
                                <Typography align='right'>
                                    {player.depthChartOrder}
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        <Grid paddingTop={1.5} sx={{borderTop: 1}} container>
                            <Grid sm={6} item>
                                <Typography sx={{display:'flex', fontSize:12}}>
                                    {player.prevYearStats.year}:
                                </Typography>
                                <Typography sx={{display: 'flex'}}>
                                    {(player.prevYearStats.pointsHalfPpr === '-') ? 0 : player.prevYearStats.pointsHalfPpr} pts
                                </Typography>
                                <Typography sx={{display: 'flex'}}>
                                    {(player.prevYearStats.gamesPlayed === '-') ? 0 : player.prevYearStats.gamesPlayed} GP
                                </Typography>
                            </Grid>

                            <Grid sm={6} item>
                                <Grid sm={12} item>
                                    <Typography align='right'>
                                        {(player.full_name) ? player.team : ' - '}
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