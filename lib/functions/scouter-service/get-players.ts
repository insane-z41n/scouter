import axios from "axios";

export type ScouterPlayerYearStats = {
    playerId: string,
    gamesPlayed: number,
    gamesStarted: number,
    passingAttempts: number | null,
    passingYards: number | null,
    passingYardsPerAttempt: number| null,
    passingTouchdowns: number | null,
    rushingAttempts: number | null,
    rushingYards: number | null,
    rushingYardsPerAttempt: number | null,
    rushingTouchdowns: number | null,
    receptions: number | null,
    receivingTargets: number | null, 
    receivingYards: number | null,
    receivingTouchdowns: number | null,
    receivingYardsPerReception: number | null, 
    fantasyPointsStandard: number,
    fantasyPointsHalfPPR: number,
    fantasyPointsPPR: number,
    overallFantasyRankPPR: number,
    positionalFantasyRankPPR: number,
}

export type ScouterProjectedYearStats = ScouterPlayerYearStats & {
    adp: number,
}

export type ScouterPlayerInfo = {
    depthChartOrder: number | null,
    fantasyPositions: Array<string>,
    firstName: string,
    lastName: string,
    injuryBodyPart: string | null,
    injuryNotes: string | null,
    injuryDateStarted: string | null,
    injuryStatus: string | null,
    rookieYear: string,
    newsUpdatedDate: number,
    primaryPosition: string,
    yearsExperience: number,
    number: number,
}

// Raw shape returned by the scouter service. Stats are keyed by year (e.g. "2025").
export type ScouterPlayer = {
    _id: string,
    status: string,
    previousStats: Record<string, ScouterPlayerYearStats>,
    projectedStats: Record<string, ScouterProjectedYearStats>,
    lastUpdated: number,
    sport: string,
    playerInfo: ScouterPlayerInfo,
    team: string,
    createdOn: number,
}

// Flattened, app-facing shape derived from ScouterPlayer.
export type Player = {
    id: string,
    name: string,
    number: string,
    position: string,
    fantasyPositions: Array<string>,
    team: string,
    depthChart: number | null,
    experience: number,
    injuryStatus: string | null,
    prevYearStats: {
        points: number,
        year: number,
        gamesPlayed: number,
        rank: number,
    } | null,
    projectedStats: {
        adp: number,
        points: number,
        year: number,
    } | null,
}

export function getLatestYearEntry<T>(statsByYear: Record<string, T>): number {
    const years = Object.keys(statsByYear).map(Number);
    if (years.length === 0) {
        throw Error('No Year Found for object keys.');
    }
    const latestYear = Math.max(...years);
    return latestYear;
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
