
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { getLatestYearEntry, ScouterPlayer } from "@/lib/functions/scouter-service/get-players";

export function PlayerNameCell({ player }: { player: ScouterPlayer }) {
    const playerName = `${player.playerInfo.firstName} ${player.playerInfo.lastName}`;
    const lastYearProjected = getLatestYearEntry(player.projectedStats);
    const lastYearPrevious = getLatestYearEntry(player.previousStats);
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="link" className="h-auto p-0" />}>
                { playerName } 
            </DialogTrigger>
            <DialogPopup render={<Card />}>
                <CardHeader>
                    <DialogTitle>{`${playerName} #${player.playerInfo.number}`}</DialogTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-sm">
                    <div>Position: {player.playerInfo.fantasyPositions.join(' | ')}</div>
                    <div>ADP: {player.projectedStats[lastYearProjected].adp}</div>
                    <div>Projected Points: {player.projectedStats[lastYearProjected].fantasyPointsPPR}</div>
                    <div>Previous Year Points: {player.previousStats[lastYearPrevious].fantasyPointsHalfPPR}</div>
                </CardContent>
            </DialogPopup>
        </Dialog>
    );
}