import { Box } from "@mui/material";
import RoundCard from "./round-card";
import { connect } from "react-redux";


const Rounds = props => {
    console.log('Loading Rounds...');
    const {numOfRounds, playerPool} = props;
    console.log(playerPool);
    const positions = Object.keys(playerPool);
    
    return (
        <Box>
            {numOfRounds.map((r) => (
                <RoundCard
                    roundNumber={r}
                    positions={positions}
                    key={`Round-${r}`}
                />
            ))}
        </Box>
    );

};
const mapStateToProps = state => {
    const {rounds, playerPool} = state.playerPool;
    const numOfRounds = Object.keys(rounds) || [];
    return {
        numOfRounds,
        playerPool: playerPool
    };
};
export default connect(mapStateToProps) (Rounds);