import { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

type Result = {
    Completed: string;
    FinishTime: string;
    CarNumber: string;
    CarName: string;
    FirstName: string;
    Heat: string;
};

export default function Heats() {
    const [data, setData] = useState<Result[]>([]);

    useEffect(() => {
        fetch('/results.json')
            .then(res => res.json())
            .then(setData);
    }, []);

    // Group results by car
    const cars: { [carNumber: string]: { label: string; points: { x: string; y: number }[] } } = {};
    data.forEach(item => {
        if (!cars[item.CarNumber]) {
            cars[item.CarNumber] = {
                label: `${item.FirstName} (${item.CarName})`,
                points: []
            };
        }
        cars[item.CarNumber].points.push({
            x: item.Completed,
            y: parseFloat(item.FinishTime)
        });
    });

        // Get all unique heats for x-axis
        const allHeats = Array.from(new Set(data.map(item => item.Heat)));
        const series = Object.entries(cars).map(([_, car]) => ({
            data: allHeats.map(heat => {
                const point = car.points.find(p => p.x === data.find(d => d.Heat === heat && d.CarName === car.label.split('(')[1]?.replace(')', '') && d.FirstName === car.label.split(' (')[0])?.Completed);
                return point ? point.y : null;
            }),
            label: car.label,
        }));

    return (
        <div className="container">
             <h2>Heats</h2>
                <LineChart
                    xAxis={[{ data: allHeats, scaleType: 'point', label: 'Heat' }]}
                    yAxis={[{
                        scaleType: 'linear',
                        label: 'Finish Time (s)'
                    }]}
                    series={series}
                    height={400}
                />
        </div>
    );
}