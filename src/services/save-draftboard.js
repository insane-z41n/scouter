import axios from "axios";
import dotenv from "dotenv/config";

const apiDomain = process.env.DOMAIN;

const saveDraftBoardUrl = (sport, boardId) => `${apiDomain}/${sport}/draft-board/${boardId}/save`;

const saveDraftBoard = async (token, boardId, sport, orderedBoard) => await axios.post(saveDraftBoardUrl(sport, boardId),
    {
        orderedBoard
    },
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.data)
    .catch((error) => {
        console.error("Error saving draft board:", error);
        throw error;
    }
);
export default saveDraftBoard;