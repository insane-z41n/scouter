import { getInfo } from "../utils/service-utils.js";

const nbaProjectionsUrl = 'https://api.sleeper.com/projections/nba/2024?season_type=regular&position[]=C&position[]=PF&position[]=PG&position[]=SF&position[]=SG&order_by=adp_std';

const getNbaProjections = async () => {
    const projections = await getInfo(`projections`, `2024-projections.json`, nbaProjectionsUrl);
    return projections;
};

export {getNbaProjections};