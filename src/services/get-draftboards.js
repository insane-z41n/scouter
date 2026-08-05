import axios from "axios";
import dotenv from "dotenv/config";

const apiDomain = process.env.DOMAIN;
const getNflDraftBoardsUrl = `${apiDomain}/nfl/draft-board`;
const getNbaDraftBoardsUrl = `${apiDomain}/nba/draft-board`;
const getDraftBoards = async (token) => await axios.all([
    getNflDraftBoards(token),
    getNbaDraftBoards(token)
]).then(axios.spread((nflBoards, nbaBoards) => {
    return [...nflBoards, ...nbaBoards];
})).catch((error) => {
    console.error("Error fetching draft boards:", error);
    throw error;
});

const getNflDraftBoards = async (token) => await axios.get(getNflDraftBoardsUrl, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
}).then((res) => res.data)
.catch((error) => {
    console.error("Error fetching NFL draft boards:", error);
    throw error;
});

const getNbaDraftBoards = async (token) => await axios.get(getNbaDraftBoardsUrl, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
}).then((res) => res.data)
.catch((error) => {
    console.error("Error fetching NBA draft boards:", error);
    throw error;
});

export default getDraftBoards;