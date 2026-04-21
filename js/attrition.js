document.addEventListener('DOMContentLoaded', () => {
    // Global Chart Defaults for Dark Theme
    Chart.defaults.color = '#a1a1aa';
    Chart.defaults.font.family = 'Outfit';

    // Top Attrition Drivers (Horizontal Bar Chart)
    const driversCtx = document.getElementById('driversChart');
    if (driversCtx) {
        new Chart(driversCtx, {
            type: 'bar',
            data: {
                labels: ['Work-Life Balance', 'Low Compensation', 'Limited Growth', 'Overwork', 'Manager Conflict', 'Long Commute'],
                datasets: [{
                    label: 'Severity Score',
                    data: [82, 74, 68, 61, 55, 43],
                    backgroundColor: (context) => {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) return null;
                        
                        const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                        gradient.addColorStop(0, '#f97316'); // Secondary Orange
                        gradient.addColorStop(1, '#ff6b00'); // Tactical Orange
                        return gradient;
                    },
                    borderRadius: 6,
                    barThickness: 24
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#18181b',
                        borderColor: '#27272a',
                        borderWidth: 1,
                        padding: 12,
                        titleColor: '#ff6b00',
                        titleFont: { size: 14, weight: '700' },
                        bodyFont: { size: 13 }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: '#27272a' },
                        ticks: { 
                            color: '#a1a1aa',
                            callback: value => value + '%'
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#ffffff', font: { weight: '500' } }
                    }
                }
            }
        });
    }

    // Staggered entry for table rows
    const rows = document.querySelectorAll('#riskTableBody tr');
    rows.forEach((row, index) => {
        row.style.animationDelay = `${0.4 + (index * 0.05)}s`;
        row.classList.add('fade-up');
    });
});
