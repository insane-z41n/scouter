import { useTheme } from "@emotion/react";
import {useDispatch} from 'react-redux';
import { saveDraft } from "./redux/player-pool";
import PlayerPool from "./components/player-pool";
import Rounds from "./components/rounds";
import { Box, Button, Container, Typography } from "@mui/material";



const App = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    console.log('Loading App...');

    return (
        <Box className="App" sx={{background:theme.palette.background}}>
            <Container>
                <Typography variant="h1" align="center">
                    SCOUTER
                </Typography>
                <Button 
                    sx={{background:theme.palette.secondary}}
                    onClick={(e) => dispatch(saveDraft())}
                >
                    Save
                </Button>
            </Container>
            <Rounds/>
            <PlayerPool/>
        </Box>
    );
};

export default App;
