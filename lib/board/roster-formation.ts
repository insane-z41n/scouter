import { ROSTER_SLOT_POSITIONS } from "@/lib/constants/nfl";
import { RosterSlot } from "@/lib/functions/scouter-service/teams";

export type Formation = {
    wr: RosterSlot[];
    te: RosterSlot[];
    flex: RosterSlot[];
    rbLeft: RosterSlot | null;
    rbRight: RosterSlot | null;
    qb: RosterSlot[];
    def: RosterSlot[];
    k: RosterSlot[];
    bench: RosterSlot[];
};

// Splits a team's roster slots into a football-field formation (adapting to
// however many of each position the board is configured with) plus a bench
// bucket for everything that doesn't have a spot in the formation - BENCH
// slots, and any RB slot beyond the two that flank the QB. WR/TE/FLEX/DEF/K
// each fan out (stacking vertically) in their own spot; RB splits to flank
// the QB in the backfield.
export function groupSlotsForFormation(slots: RosterSlot[]): Formation {
    const wr: RosterSlot[] = [];
    const te: RosterSlot[] = [];
    const flex: RosterSlot[] = [];
    const qb: RosterSlot[] = [];
    const rb: RosterSlot[] = [];
    const def: RosterSlot[] = [];
    const k: RosterSlot[] = [];
    const bench: RosterSlot[] = [];

    for (const slot of slots) {
        switch (slot.position) {
            case "WR":
                wr.push(slot);
                break;
            case "TE":
                te.push(slot);
                break;
            case "FLEX":
                flex.push(slot);
                break;
            case "QB":
                qb.push(slot);
                break;
            case "RB":
                rb.push(slot);
                break;
            case "DEF":
                def.push(slot);
                break;
            case "K":
                k.push(slot);
                break;
            default:
                bench.push(slot);
        }
    }

    const [rbLeft = null, rbRight = null, ...overflowRb] = rb;
    bench.push(...overflowRb);
    bench.sort(
        (a, b) => ROSTER_SLOT_POSITIONS.indexOf(a.position as never) - ROSTER_SLOT_POSITIONS.indexOf(b.position as never)
    );

    return { wr, te, flex, rbLeft, rbRight, qb, def, k, bench };
}

// Positions that can also fill a FLEX slot, matching real fantasy roster rules.
const FLEX_ELIGIBLE_POSITIONS = new Set(["RB", "WR", "TE"]);

// Where a player should land when added to a team: their own position first
// (e.g. RB into the first open RB slot, then the next), then FLEX if they're
// flex-eligible, then the bench - never a manual choice of slot.
export function findBestOpenSlot(slots: RosterSlot[], playerPosition: string): RosterSlot | null {
    const natural = slots.find((s) => !s.playerId && s.position === playerPosition);
    if (natural) return natural;

    if (FLEX_ELIGIBLE_POSITIONS.has(playerPosition)) {
        const flexSlot = slots.find((s) => !s.playerId && s.position === "FLEX");
        if (flexSlot) return flexSlot;
    }

    return slots.find((s) => !s.playerId && s.position === "BENCH") ?? null;
}
