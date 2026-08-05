import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDraftBoard } from './DraftBoardProvider';
import DraftBoard from './DraftBoard'; // Assuming you have a DraftBoard component
import DraftBoardSelector from './DraftBoardSelector'; // Assuming you have a DraftBoardSelector component
import getDraftBoards from '../services/get-draftboards.js'; // Assuming you have a service
import { SET_DRAFT_BOARDS } from '../redux/draftBoardReducer'; // Assuming you have a reducer action


export const ScouterConext = ({token}) => {
    const {dispatch, selectedDraftBoard} = useDraftBoard();
    console.log("Scouter Context component rendered");
    const theme = useTheme();

    // Fetch draft boards
    useEffect(() => {
         const fetchBoards = async () => {
            const resDraftBoards = await getDraftBoards(token);
            dispatch({ type: SET_DRAFT_BOARDS, payload: resDraftBoards });
        };
        fetchBoards();
    }, [token, dispatch]);

    return (
        <div>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                bgcolor: theme.palette.background.default,
                boxSizing: 'border-box',
                width: '100vw',
                overflowX: 'hidden',
            }}>
                <Box
                    sx={{
                        width: '100%',
                        mx: 'auto',
                        bgcolor: theme.palette.background.paper,
                        boxShadow: 3,
                        p: { xs: 2, sm: 4 }, // Responsive inner padding
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Typography variant="h2" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 700 }}>
                            SCOUTER
                        </Typography>
                        <DraftBoardSelector token={token} />
                        <AnimatePresence>
                            {(() => {
                                return selectedDraftBoard && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Box sx={{
                                            mt: 2,
                                            p: { xs: 1, sm: 2 },
                                            bgcolor: theme.palette.background.default,
                                            borderRadius: 3,
                                            overflow: 'auto',
                                            maxHeight: { xs: 900, sm: 2000 },
                                            width: '100%',
                                            boxSizing: 'border-box',
                                        }}>
                                            <DraftBoard />
                                        </Box>
                                    </motion.div>
                                );
                            })()}
                        </AnimatePresence>
                    </motion.div>
                </Box>
            </Box>
        </div>
    );
}

export default ScouterConext;