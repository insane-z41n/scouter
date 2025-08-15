import { getInfo } from '../utils/service-utils.js';

const getPlayersUrl = 'https://api.sleeper.app/v1/players/nba';

const getNbaPlayers = async () => {

    const nbaPlayers = await getInfo(`players`, `2024-players.json`, getPlayersUrl);
    return Object.values(nbaPlayers).filter(p => p.active && p.team);
};

export {getNbaPlayers};