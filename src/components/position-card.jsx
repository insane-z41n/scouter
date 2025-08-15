import { Box, Typography} from '@mui/material';
import { Reorder } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import PlayerCard from './player-card';
import { connect, useDispatch } from 'react-redux';
import { roundUpdate } from '../redux/player-pool';

const Position = props => {
    const {playersInPosition, positionGroup, currentRound} = props;
    console.log(`Loading Poisition ${positionGroup} Card for round ${currentRound}...`);
    const [getPlayers, setPlayers] = useState(playersInPosition);
    const prevPlayersRef = useRef(playersInPosition);
    const dispatch = useDispatch();
    console.log(getPlayers)
    useEffect(() => {
        // Only update local state if the prop actually changed (not due to reorder)
        if (prevPlayersRef.current !== playersInPosition) {
            setPlayers(playersInPosition);
            prevPlayersRef.current = playersInPosition;
        }
    }, [playersInPosition])

    // Trigger side effects when getPlayers changes (e.g., after reorder)
    useEffect(() => {
        console.log('Players reordered:', getPlayers);
        // Add any other side effects here
    }, [getPlayers]);

    // Replace setPlayers with a dispatch to update Redux on reorder
    const handleReorder = (newOrder) => {
        setPlayers(newOrder); // for local UI
        dispatch({
            type: 'playerPool/REORDER_PLAYERS_IN_POSITION',
            payload: {
                positionGroup,
                currentRound,
                newOrder,
            }
        });
    };

    return (
        <Box sx={{minWidth:240}}>
            <Typography variant='h6' align='center'>
                {positionGroup}
            </Typography>
            {getPlayers && 
                <Reorder.Group axis="y" values={getPlayers} onReorder={handleReorder} as="div">
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