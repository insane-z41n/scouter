
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

import { ScouterPlayer } from "@/lib/functions/scouter-service/get-players";

export function PlayerNameCell({ player }: { player: ScouterPlayer }) {
    const playerName = `${player.playerInfo.firstName} ${player.playerInfo.lastName}`;
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
                </CardHeader>
                <CardContent>
                    <PlayerStatsChart player={player} />
                </CardContent>
            </DialogPopup>
        </Dialog>
    );
}