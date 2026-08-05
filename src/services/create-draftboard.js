import axios from "axios";
import dotenv from "dotenv/config";

const apiDomain = process.env.DOMAIN;

const createDraftBoardUrl = (sport) => `${apiDomain}/${sport}/draft-board/create`;


const createDraftBoards = async (token, draftBoardName, sport) => await axios.post(createDraftBoardUrl(sport),
    {
        draftBoardName
    }, 
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.data)
    .catch((error) => {
        console.error("Error creating draft board:", error);
        throw error;
    }
);
export default createDraftBoards;

