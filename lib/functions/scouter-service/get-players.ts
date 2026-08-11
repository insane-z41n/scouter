import axios from "axios";

export type ScouterPlayer = {
    id: string,
    name: string,
    number: string,
    position: string,
    fantasyPositions: Array<string>,
    team: string,
    depthChart: number,
    experience: number,
    injuryStatus: null,
    prevYearStats: {
        points: number,
        year: number, 
        gamesPlayed: number, 
        rank: number,
    },
    projectedStats: {
        adp: number,
        points: number,
        year: number,
    }
}

export async function getScouterPlayers(sport: string): Promise<ScouterPlayer[]> {
    
    const url = `${process.env.SCOUTER_API_DOMAIN}/${sport}/players`;
    
    try {
        console.log(`Scouter UI Calling: ${url}`)
        const response = await axios.get<ScouterPlayer[]>(url);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                "Failed to fetch scouter players:",
                error.response?.status,
                error.response?.data ?? error.message
            );
        }
        throw error;
    }
}
