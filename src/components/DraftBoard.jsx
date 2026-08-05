import { useDraftBoard } from "./DraftBoardProvider"; // Assuming you have a DraftBoardProvider to manage state
import { Box } from "@mui/material";
import PlayerPool from "./PlayerPool";
import Drafted from "./Drafted";
import Round from "./Round"; // Assuming you have a Round component to display each round


const DraftBoard = () => {
    const { selectedDraftBoard } = useDraftBoard(); // Assuming useDraftBoard is a custom hook to access the context
    console.log("DraftBoard component rendered with board:", selectedDraftBoard);

    const rounds = selectedDraftBoard?.rounds || {};
    console.log("Rounds in DraftBoard:", rounds);
    return (
        <Box>
            <div style={{ marginTop: 40 }}>
                {Object.keys(rounds)
                    .filter(roundKey => roundKey !== 'player-pool' && roundKey !== 'drafted')
                    .map((roundKey) => (
                        <Round round={rounds[roundKey]} roundKey={roundKey}/>
                    ))
                }
            </div>
            <div>
                <PlayerPool round={rounds['player-pool']} roundKey={'player-pool'}/>
                <Drafted round={rounds['drafted']} roundKey={'drafted'}/>
            </div>
        </Box>
    );
};

export default DraftBoard;
