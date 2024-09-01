
import { Box, Typography} from '@mui/material';
import { Reorder } from 'framer-motion';
import { useEffect, useState } from 'react';
import PlayerCard from './player-card';
import { connect } from 'react-redux';

const Position = props => {
    const {playersInPosition, positionGroup, currentRound} = props;
    console.log(`Loading Poisition ${positionGroup} Card for round ${currentRound}...`);
    const [getPlayers, setPlayers] = useState(playersInPosition);
    useEffect(() => {
        setPlayers(playersInPosition);
    }, [playersInPosition])

    return (
        <Box sx={{minWidth:240}}>
            <Typography align='center'>
                {positionGroup}
            </Typography>
            {getPlayers && 
                <Reorder.Group values={getPlayers} onReorder={setPlayers} as="div">
                    {getPlayers.map((p) => (
                        <Reorder.Item value={p} key={p.playerId} as="div">
                            <PlayerCard
                                player={p}
                                playersInPosition={playersInPosition}
                                getPlayers={getPlayers}
                                setPlayers={setPlayers}
                                currentRound={currentRound}
                            />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            }
        </Box>
    );
}

const mapStateToPropsPosition = (state, props) => {
    
    if(props.currentRound === 'player-pool') {
        return {
            playersInPosition: state.playerPool.playerPool[props.positionGroup]
        }
    }
    else {
        return {
            playersInPosition: state.playerPool.rounds[props.currentRound][props.positionGroup]
        }
    }

}

export default connect(mapStateToPropsPosition)(Position);