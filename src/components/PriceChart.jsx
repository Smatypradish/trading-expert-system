import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function PriceChart({ data, signal }) {
    const chartData = useMemo(() => {
        if (!data?.prices) return null;

        const labels = data.prices.map(p => {
            const date = new Date(p.time);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const prices = data.prices.map(p => p.price);

        // Determine gradient color based on signal
        const gradientColors = {
            BUY: { start: 'rgba(16, 185, 129, 0.3)', end: 'rgba(16, 185, 129, 0)' },
            SELL: { start: 'rgba(239, 68, 68, 0.3)', end: 'rgba(239, 68, 68, 0)' },
            HOLD: { start: 'rgba(245, 158, 11, 0.3)', end: 'rgba(245, 158, 11, 0)' }
        };

        const lineColors = {
            BUY: '#10b981',
            SELL: '#ef4444',
            HOLD: '#f59e0b'
        };

        return {
            labels,
            datasets: [
                {
                    label: 'Price',
                    data: prices,
                    borderColor: lineColors[signal] || '#6366f1',
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, gradientColors[signal]?.start || 'rgba(99, 102, 241, 0.3)');
                        gradient.addColorStop(1, gradientColors[signal]?.end || 'rgba(99, 102, 241, 0)');
                        return gradient;
                    },
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: lineColors[signal] || '#6366f1',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }
            ]
        };
    }, [data, signal]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#94a3b8',
                borderColor: '#2a3548',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        return `$${context.raw.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: context.raw >= 1 ? 2 : 6
                        })}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#64748b',
                    maxTicksLimit: 7,
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(42, 53, 72, 0.5)',
                    drawBorder: false
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 11
                    },
                    callback: (value) => {
                        if (value >= 1000) {
                            return '$' + (value / 1000).toFixed(1) + 'K';
                        }
                        return '$' + value.toFixed(value >= 1 ? 0 : 4);
                    }
                }
            }
        }
    };

    if (!chartData) {
        return (
            <div style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-muted)'
            }}>
                No price data available
            </div>
        );
    }

    return (
        <div style={{
            height: '300px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-md)'
        }}>
            <Line data={chartData} options={options} />
        </div>
    );
}

export default PriceChart;
