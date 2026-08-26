// Roster slot types a Team can be configured with (multiples of each allowed).
// Mirrors ROSTER_SLOT_POSITIONS in scouter-svc's src/utils/constants.js.
export const ROSTER_SLOT_POSITIONS = ["QB", "RB", "WR", "TE", "FLEX", "DEF", "K", "BENCH"] as const;

export type RosterSlotPosition = (typeof ROSTER_SLOT_POSITIONS)[number];
