import { createContext, useContext, useReducer, useState, useEffect } from "react";
import { draftBoardReducer } from "../redux/draftBoardReducer";

const DraftBoardContext = createContext();

export const DraftBoardProvider = ({ children, initialDraftBoard = [] }) => {
    const [state, dispatch] = useReducer(draftBoardReducer, initialDraftBoard);
    const [selectedDraftBoard, setSelectedDraftBoard] = useState({});

    // Update selectedDraftBoard when state changes
    useEffect(() => {
        if (selectedDraftBoard?._id) {
            const updatedBoard = state.find(board => board._id === selectedDraftBoard._id);
            if (updatedBoard && JSON.stringify(updatedBoard) !== JSON.stringify(selectedDraftBoard)) {
                setSelectedDraftBoard(updatedBoard);
            }
        }
    }, [state, selectedDraftBoard?._id]);

    const value = {
        draftBoards: state,
        dispatch,
        selectedDraftBoard,
        setSelectedDraftBoard   
    };

    return (
        <DraftBoardContext.Provider value={value}>
            {children}
        </DraftBoardContext.Provider>
    );
};

export const useDraftBoard = () => useContext(DraftBoardContext);