import { getInfo } from "../utils/service-utils.js";

const nbaLeagueUrl = 'https://api.sleeper.app/v1/user/465040417230942208/leagues/nba/2024';

const getLeagueSettings = async () => {
    const projections = await getInfo(`league`, `2024-league.json`, nbaLeagueUrl);
    return projections;
};

export {getLeagueSettings};