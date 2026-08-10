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
    try {
        const response = await axios.get<ScouterPlayer[]>(`${process.env.SCOUTER_API_DOMAIN}/${sport}/players`);
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

const mockScouterPlayers: ScouterPlayer[] = [
    {
        "projectedStats": {
            "adp": 999,
            "points": 28.72,
            "year": 2026
        },
        "prevYearStats": {
            "points": 156.66,
            "year": 2025,
            "gamesPlayed": 10,
            "rank": 27
        },
        "id": "19",
        "name": "Joe Flacco",
        "number": "16",
        "position": "QB",
        "fantasyPositions": [
            "QB"
        ],
        "team": "CIN",
        "depthChart": 2,
        "experience": 18,
        "injuryStatus": null
    },
    {
        "projectedStats": {
            "adp": 999,
            "points": 177,
            "year": 2026
        },
        "prevYearStats": {
            "points": 234.08,
            "year": 2025,
            "gamesPlayed": 15,
            "rank": 18
        },
        "id": "96",
        "name": "Aaron Rodgers",
        "number": "8",
        "position": "QB",
        "fantasyPositions": [
            "QB"
        ],
        "team": "PIT",
        "depthChart": 1,
        "experience": 21,
        "injuryStatus": null
    },
    {
        "projectedStats": {
            "adp": 999,
            "points": 11.34,
            "year": 2026
        },
        "prevYearStats": {
            "points": 26.38,
            "year": 2025,
            "gamesPlayed": 2,
            "rank": 53
        },
        "id": "260",
        "name": "Josh Johnson",
        "number": "11",
        "position": "QB",
        "fantasyPositions": [
            "QB"
        ],
        "team": "CIN",
        "depthChart": 3,
        "experience": 18,
        "injuryStatus": null
    },
];
