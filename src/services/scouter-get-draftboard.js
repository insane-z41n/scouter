import axios from 'axios';

const getDraftBoard = async (scouterId, sport) => {
    try {
        const url = `http://localhost:3000/${sport}/players/draft-board/${scouterId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching database:', error);
        throw error;
    }
};

export { getDraftBoard };