import PlayerPool from "./components/player-pool";
import Rounds from "./components/rounds";
import { Typography } from "@mui/material";


const App = () => {
    console.log('Loading App...');

    return (
        <div className="App">
            <Typography variant="h1" align="center">
                SCOUTER
            </Typography>
            <Rounds/>
            <PlayerPool/>
        </div>
    );
};

export default App;
