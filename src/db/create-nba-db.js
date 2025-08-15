import { getNbaPlayers } from "./services/nba-players.js";
import { getNbaProjections } from "./services/nba-projected-stats.js";
import { getNbaStats } from "./services/nba-stats.js";
import { getLeagueSettings } from "./services/league-settings.js";
import { JSONToFile, readJsonFile } from "./utils/json-utils.js";

const getPlayerProjections = (projections, playerId) => projections.find(p => p.player_id === playerId);
const getPlayerStats = (stats, playerId) => stats.find(s => s.player_id === playerId);
const main = async () => {
    const players = await getNbaPlayers();
    const stats = await getNbaStats();
    const projections = await getNbaProjections();
    const leagueSettings = await getLeagueSettings();

    const scoringSetting = leagueSettings[0].scoring_settings;
   
    const projectedStats = projections.map(p => {
        const keys = Object.keys(p.stats);
        let total = 0;
        keys.forEach(k => {
            if(scoringSetting[k]) {
                total += p.stats[k] * scoringSetting[k]; 
            }
        });
        return {
            ...p,
            stats: {
                ...p.stats,
                leaguePts: total
            }
        };
    });

    const leagueStats = stats.map(s => {
        const keys = Object.keys(s.stats);
        let total = 0;
        keys.forEach(k => {
            if(scoringSetting[k]) {
                total += s.stats[k] * scoringSetting[k]; 
            }
        });

        return {
            ...s,
            stats: {
                ...s.stats,
                leaguePts: total
            }
        };
    });

    console.log(leagueStats);

    const mappedPlayers = players.map(p => {
        const playerId = p.player_id;
        const playerStats = getPlayerStats(leagueStats, playerId);
        const playerProjections = getPlayerProjections(projectedStats , playerId);

        return {
            full_name: p.full_name,
            team: p.team,
            age: p.age,
            experience: p.years_exp,
            playerId,
            positions: p.fantasy_positions,
            playerPosition: p.position,
            depthChartOrder: p.depth_chart_order,
            injury: (p.injury_status) ? `${p.injury_status} | ${p.injury_body_part} ` : "-",
            roundEval: 0,
            projectedStats: {
                adp: playerProjections?.stats?.adp_std,
                year: 2024,
                pointsHalfPpr: parseFloat(playerProjections?.stats?.leaguePts.toFixed(2))
            },
            prevYearStats: {
                year: 2023,
                pointsHalfPpr: (playerStats?.stats?.pts && playerStats?.stats?.gp) ? parseFloat((playerStats?.stats?.leaguePts/playerStats?.stats?.gp).toFixed(2)) : "-", 
                gamesPlayed: (playerStats?.stats?.gp) ? playerStats?.stats?.gp : "-",
                ranking: (playerStats?.stats?.pos_rank_std) ? playerStats?.stats?.pos_rank_st : "-"
            }
        };
    });
    const sortedMappedPlayers = mappedPlayers.sort((a, b) => a.projectedStats.adp - b.projectedStats.adp);
    
    const playerDb = {"player-pool": {PG: [], SG: [], SF: [], PF: [], C: []}}
    for(let player of sortedMappedPlayers) {
        const position = player.playerPosition;
        if(position === 'DEF') {
            continue;
        }
        if(!playerDb['player-pool'][position]) {
            playerDb['player-pool'][position] = [player];
        }
        else {
            playerDb['player-pool'][position].push(player);
        }
    }

    JSONToFile(playerDb, 'db', 'players-db.json');
    const formatted = readJsonFile('db', 'players-db.json');

}

main();