import RoundCard from "./round-card";
import { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";


const Rounds = props => {
    console.log('Loading Rounds...');
    const {numOfRounds} = props;
    const {rounds, playerPool} = useSelector(state => state.playerPool);
    const positions = Object.keys(playerPool);
    
    console.log('Players: ', rounds);
    console.log('Rounds: ', numOfRounds);
    return (
        <div>
            {numOfRounds.map((r) => (
                <RoundCard
                    players={rounds[r]}
                    roundNumber={r}
                    positions={positions}
                    key={`Round-${r}`}
                />
            ))}
        </div>
    );

};
const mapStateToProps = state => {
    const {rounds} = state.playerPool;
    const numOfRounds = Object.keys(rounds) || [];
    return {
        numOfRounds
    };
};
export default connect(mapStateToProps) (Rounds);