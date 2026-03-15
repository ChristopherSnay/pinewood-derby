import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// Typography removed (not used)

type StandingsEntry = {
    Place: string;
    "Car Number": string;
    Name: string;
    "Car Name": string;
    Heats: string;
    Average: string;
    Best: string;
    Worst: string;
};

export default function Overall() {
    const [data, setData] = useState<StandingsEntry[]>([]);

    useEffect(() => {
        fetch('/standings.json')
            .then(r => r.json())
            .then((d: StandingsEntry[]) => setData(d || []));
    }, []);

    const sorted = [...data].sort((a, b) => Number(a.Place) - Number(b.Place));

    return (
        <div className="container">
           <h2>Final Standings</h2>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table size="small" aria-label="standings table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Driver</TableCell>
                            <TableCell>Car</TableCell>
                            <TableCell>Heats</TableCell>
                            <TableCell>Avg (s)</TableCell>
                            <TableCell>Best (s)</TableCell>
                            <TableCell>Worst (s)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sorted.map((row) => (
                            <TableRow key={row["Car Number"]} hover>
                                <TableCell>{row.Place}</TableCell>
                                <TableCell>
                                    <div style={{ fontWeight: 600 }}>{row.Name.trim()}</div>
                                    <div style={{ fontSize: 12, color: '#555' }}>#{row["Car Number"]}</div>
                                </TableCell>
                                <TableCell>{row["Car Name"]}</TableCell>
                                <TableCell>{row.Heats}</TableCell>
                                <TableCell>{Number(row.Average).toFixed(3)}</TableCell>
                                <TableCell>{Number(row.Best).toFixed(3)}</TableCell>
                                <TableCell>{Number(row.Worst).toFixed(3)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
