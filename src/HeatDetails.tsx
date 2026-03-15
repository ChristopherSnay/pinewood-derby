import { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

type Result = {
    Heat: string;
    CarName: string;
    FirstName: string;
    FinishTime: string;
    FinishPlace?: string;
};

export default function HeatDetails () {
    const [data, setData] = useState<Result[]>([]);
    // track whether to show the chart for a given heat; undefined -> default to table view
    const [showChart, setShowChart] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetch('/results.json')
            .then(res => res.json())
            .then(setData);
    }, []);

    // Group by heat
    const heats = Array.from(new Set(data.map(d => d.Heat)));

    return (
        <div className="container">
            <h2>Heat Details</h2>
            <div className="row">
                {heats.map(heat => {
                    const heatResults = data.filter(d => d.Heat === heat);
                    // const fullLabels = heatResults.map(d => `${d.FirstName} (${d.CarName})`);
                    const times = heatResults.map(d => parseFloat(d.FinishTime));
                    // Show only the FirstName as the x-axis label so labels don't overlap
                    const displayLabels = heatResults.map(d => d.FirstName);

                    // simple per-heat colors will be generated below

                    // Single series with one value per category so bars are wide; palette provides per-bar colors
                    const palette = heatResults.map((_, idx) => `hsl(${Math.round((idx * 360) / Math.max(1, heatResults.length))} 65% 45%)`);

                    // Compute y-axis domain per heat to spread results out
                    const numericTimes = times.map(t => Number(t)).filter(t => !isNaN(t));
                    let yMin = 0;
                    let yMax = 1;
                    if (numericTimes.length > 0) {
                        const tMin = Math.min(...numericTimes);
                        const tMax = Math.max(...numericTimes);
                        if (tMin === tMax) {
                            yMin = tMin - 0.05;
                            yMax = tMax + 0.05;
                        } else {
                            const pad = Math.max(0.01, (tMax - tMin) * 0.08);
                            yMin = Math.max(0, tMin - pad);
                            yMax = tMax + pad;
                        }
                    }

                    // default: table view shown; if showChart[heat] is true, show chart instead
                    const isChart = showChart[heat] ?? false;
                    const isTable = !isChart;

                    const toggle = () => setShowChart(s => ({ ...s, [heat]: !s[heat] }));
                    return (
                        <div className="col-12 mb-4" key={heat}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <h5 className="card-title">Heat {heat}</h5>
                                        <FormControlLabel control={<Switch checked={isChart} onChange={toggle} />} label="Show chart" />
                                    </div>
                                    {isTable ? (
                                        <div className="table-responsive">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Place</th>
                                                        <th>First Name</th>
                                                        <th>Car Name</th>
                                                        <th>Time (s)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {([...heatResults].sort((a,b)=> (Number(a.FinishPlace)||0) - (Number(b.FinishPlace)||0))).map((r, idx) => (
                                                        <tr key={idx}>
                                                            <td>{r.FinishPlace}</td>
                                                            <td>{r.FirstName}</td>
                                                            <td>{r.CarName}</td>
                                                            <td>{r.FinishTime}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div style={{ paddingTop: 8 }}>
                                            <div style={{ height: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 18, padding: '0 8px' }}>
                                                {times.map((t, i) => {
                                                    const val = Number(t);
                                                    const maxPx = 260;
                                                    let h = 12;
                                                    if (!isNaN(val)) {
                                                        const tmin = yMin;
                                                        const tmax = yMax;
                                                        const pct = tmax > tmin ? (val - tmin) / (tmax - tmin) : 0.8;
                                                        h = Math.max(12, Math.round(pct * maxPx));
                                                    }
                                                    const color = palette[i] || '#7e57c2';
                                                    const barWidth = Math.max(56, Math.min(220, Math.floor(920 / Math.max(1, times.length))));
                                                    return (
                                                        <div key={i} style={{ width: barWidth, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <div style={{ marginBottom: 6, fontSize: 12 }}>{isNaN(Number(t)) ? '-' : `${Number(t).toFixed(3)}s`}</div>
                                                            <div style={{ height: h, width: '100%', background: color, borderRadius: 6, boxShadow: 'inset 0 -6px 8px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)' }} />
                                                            <div style={{ marginTop: 8, fontSize: 12, textAlign: 'center' }}>{displayLabels[i]}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}