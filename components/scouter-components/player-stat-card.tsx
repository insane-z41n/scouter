
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogDescription,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PlayerStatsChart } from "@/components/scouter-components/player-stats-chart";

import { getLatestYearEntry, ScouterPlayer } from "@/lib/functions/scouter-service/get-players";

export function PlayerNameCell({ player }: { player: ScouterPlayer }) {
    const playerName = `${player.playerInfo.firstName} ${player.playerInfo.lastName}`;
    const previousLatestYear = getLatestYearEntry(player.previousStats);
    console.log("OVERALL PPR RANK: ", player.previousStats[previousLatestYear]);
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="link" className="h-auto p-0" />}>
                { playerName }
            </DialogTrigger>
            <DialogPopup render={<Card />} className="max-w-lg">
                <CardHeader>
                    <DialogTitle>{`${playerName} #${player.playerInfo.number}`}</DialogTitle>
                    <DialogDescription>
                        {player.team} - {player.playerInfo.fantasyPositions.join(' | ')}
                    </DialogDescription>
                    <DialogDescription>
                        Position Rank - {player.previousStats[previousLatestYear].positionalFantasyRankPPR}
                    </DialogDescription>
                    <DialogDescription>
                        Overall Rank - {player.previousStats[previousLatestYear].overrallFantasyRankPPR}
                    </DialogDescription>
                </CardHeader>
                <CardContent>
                    <PlayerStatsChart player={player} />
                </CardContent>
            </DialogPopup>
        </Dialog>
    );
}