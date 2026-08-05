import React, { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import Position from "./Position";

const Round = React.memo(({round, roundKey}) => {
    const theme = useTheme();
    const roundName = roundKey === 'player-pool' ? 'Player Pool' : `Round ${roundKey}`;
    
    const positions = useMemo(() => {
        return round ? Object.keys(round) : [];
    }, [round]);

    return (
        <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
            <Typography variant="h4" style={{ color: theme.palette.primary.main, textAlign: 'center', marginBottom: 10 }}>
                {roundName}
            </Typography>
            <hr style={{ borderColor: theme.palette.primary.main, marginBottom: 20, height: 3, width: '100%' }} />
            <div style={{ display: 'flex', gap: 0, width: '100%' }}>
                {positions.map((positionKey) => (
                    <Position 
                        key={positionKey} 
                        position={round?.[positionKey] || []} 
                        positionKey={positionKey}
                        roundKey={roundKey}
                    />
                ))}
            </div>
        </div>
    );
});

export default Round;