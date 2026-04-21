document.addEventListener('DOMContentLoaded', () => {
    // Global Chart Defaults for Dark Theme
    Chart.defaults.color = '#a1a1aa';
    Chart.defaults.font.family = 'Outfit';

    let trendChart, distChart;

    // Data Mockup for Departments
    const deptData = {
        'Engineering': { trend: [75, 78, 82, 80, 84, 86], dist: [42, 28, 15, 5] },
        'Sales': { trend: [68, 72, 70, 74, 73, 76], dist: [25, 45, 20, 10] },
        'HR': { trend: [82, 81, 85, 83, 86, 88], dist: [55, 30, 10, 5] },
        'Design': { trend: [74, 76, 75, 79, 81, 80], dist: [35, 40, 15, 10] },
        'Marketing': { trend: [62, 65, 68, 67, 70, 69], dist: [20, 35, 30, 15] }
    };

    // 1. Monthly Performance Trend (Multi-line Chart)
    const trendCtx = document.getElementById('monthlyTrendChart');
    if (trendCtx) {
        trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Engineering',
                        data: deptData['Engineering'].trend,
                        borderColor: '#ff6b00',
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#121214'
                    },
                    {
                        label: 'Sales',
                        data: deptData['Sales'].trend,
                        borderColor: '#f97316',
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#121214'
                    },
                    {
                        label: 'HR',
                        data: deptData['HR'].trend,
                        borderColor: '#fb923c',
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#121214'
                    },
                    {
                        label: 'Design',
                        data: deptData['Design'].trend,
                        borderColor: '#fdba74',
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 4,
                        pointBackgroundColor: '#121214'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'top', 
                        labels: { 
                            color: '#ffffff',
                            font: { family: 'Outfit' },
                            usePointStyle: true
                        } 
                    },
                    tooltip: {
                        backgroundColor: '#18181b',
                        borderColor: '#27272a',
                        borderWidth: 1,
                        titleColor: '#ff6b00'
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: false, 
                        min: 60,
                        grid: { color: '#27272a' },
                        ticks: { color: '#a1a1aa' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#a1a1aa' }
                    }
                }
            }
        });
    }

    // 2. Score Distribution (Doughnut Chart)
    const distCtx = document.getElementById('scoreDistChart');
    if (distCtx) {
        distChart = new Chart(distCtx, {
            type: 'doughnut',
            data: {
                labels: ['Excellent', 'Good', 'Average', 'Below Average'],
                datasets: [{
                    data: [62, 98, 61, 27],
                    backgroundColor: ['#ff6b00', '#f97316', '#fb923c', '#450a0a'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { 
                        position: 'bottom', 
                        labels: { 
                            usePointStyle: true, 
                            padding: 20, 
                            color: '#a1a1aa',
                            font: { family: 'Outfit' } 
                        } 
                    }
                }
            }
        });
    }

    // Interactive Filtering Logic
    const deptRows = document.querySelectorAll('.dept-table tbody tr');
    deptRows.forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
            // Highlight row
            deptRows.forEach(r => r.style.background = '');
            row.style.background = 'rgba(255, 107, 0, 0.05)';
            
            const dept = row.cells[0].innerText.trim();
            const data = deptData[dept];
            
            if (data) {
                // Focus trend chart on selected dept
                trendChart.data.datasets.forEach(ds => {
                    if (ds.label === dept) {
                        ds.borderWidth = 5;
                        ds.pointRadius = 6;
                    } else {
                        ds.borderWidth = 1;
                        ds.pointRadius = 0;
                    }
                });
                trendChart.update();

                // Update doughnut chart
                distChart.data.datasets[0].data = data.dist;
                distChart.update();

                // Update center label (optional logic here)
                const total = data.dist.reduce((a, b) => a + b, 0);
                const label = document.querySelector('.card .employees-count-text') || { innerText: '' };
                // (Note: The doughnut center label is a separate div in our HTML, we could target its ID)
            }
        });
    });

    // Score Ring Animation Logic
    const rings = document.querySelectorAll('.score-ring-progress');
    const circumference = 2 * Math.PI * 45; // Radius is 45

    rings.forEach(ring => {
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference;
        
        const score = parseInt(ring.getAttribute('data-score'));
        const offset = circumference - (score / 100) * circumference;
        
        // Trigger animation after a slight delay
        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 300);
    });

    // Staggered entry for individual cards
    const cards = document.querySelectorAll('.score-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${0.5 + (index * 0.1)}s`;
    });
});
