import { getInfo } from '../utils/service-utils.js';

const getStatsUrl = 'https://api.sleeper.com/stats/nba/2023?season_type=regular&position[]=C&position[]=PF&position[]=PG&position[]=SF&position[]=SG';

const getNbaStats = async () => {
    const stats = await getInfo(`stats`, `2023-stats.json`, getStatsUrl);
    return stats;
};

export {getNbaStats};