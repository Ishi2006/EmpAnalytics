document.addEventListener('DOMContentLoaded', () => {
    // Global Chart Defaults for Dark Theme
    Chart.defaults.color = '#a1a1aa';
    Chart.defaults.font.family = 'Outfit';
    
    let performanceChart, workloadChart;
    let liveSimulationInterval = null;

    // 1. Performance Trend Chart (Line Chart)
    const perfCtx = document.getElementById('performanceTrendChart');
    if (perfCtx) {
        performanceChart = new Chart(perfCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Engineering',
                        data: [78, 82, 85, 84, 89, 92],
                        borderColor: '#ff6b00',
                        backgroundColor: 'rgba(255, 107, 0, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 2,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#ff6b00'
                    },
                    {
                        label: 'Sales',
                        data: [65, 70, 68, 75, 82, 80],
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 2,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#f97316'
                    },
                    {
                        label: 'HR',
                        data: [85, 84, 88, 86, 85, 88],
                        borderColor: '#fb923c',
                        backgroundColor: 'rgba(251, 146, 60, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 2,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#fb923c'
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
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12 },
                            color: '#ffffff'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        padding: 12,
                        backgroundColor: '#18181b',
                        borderColor: '#27272a',
                        borderWidth: 1,
                        titleFont: { size: 14, weight: '700' },
                        bodyFont: { size: 13 },
                        titleColor: '#ff6b00'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 50,
                        grid: { color: '#27272a', drawBorder: false },
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

    // 2. Department Workload Chart (Horizontal Bar Chart)
    const workCtx = document.getElementById('workloadChart');
    if (workCtx) {
        workloadChart = new Chart(workCtx, {
            type: 'bar',
            data: {
                labels: ['Engineering', 'Product', 'Sales', 'Marketing', 'HR'],
                datasets: [{
                    data: [85, 72, 64, 58, 42],
                    backgroundColor: [
                        '#ff6b00', '#f97316', '#fb923c', '#fdba74', '#fed7aa'
                    ],
                    borderRadius: 8,
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
                        titleColor: '#ff6b00'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: '#27272a', drawBorder: false },
                        ticks: { color: '#a1a1aa' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#ffffff', font: { weight: '500' } }
                    }
                }
            }
        });
    }

    // Simulation Engine Logic
    const startSimulation = () => {
        if (liveSimulationInterval) return;
        
        liveSimulationInterval = setInterval(() => {
            // Jitter Chart Data
            if (performanceChart) {
                performanceChart.data.datasets.forEach(dataset => {
                    const lastIdx = dataset.data.length - 1;
                    const change = (Math.random() - 0.5) * 4;
                    dataset.data[lastIdx] = Math.min(100, Math.max(50, dataset.data[lastIdx] + change));
                });
                performanceChart.update('none'); // Update without animation for continuous feel
            }

            if (workloadChart) {
                workloadChart.data.datasets[0].data = workloadChart.data.datasets[0].data.map(val => {
                    const change = (Math.random() - 0.5) * 2;
                    return Math.min(100, Math.max(20, val + change));
                });
                workloadChart.update('none');
            }

            // Jitter Stat Counters
            jitterStat("count-tasks", 134, 5);
            jitterStat("count-perf", 76.4, 0.5, true);
            jitterStat("count-attr", 18, 1);
        }, 3000);
    };

    const stopSimulation = () => {
        if (liveSimulationInterval) {
            clearInterval(liveSimulationInterval);
            liveSimulationInterval = null;
        }
    };

    const jitterStat = (id, base, range, isDecimal = false) => {
        const el = document.getElementById(id);
        if (!el) return;
        const offset = (Math.random() - 0.5) * range;
        const val = base + offset;
        el.innerHTML = isDecimal ? val.toFixed(1) + '%' : Math.round(val);
        el.style.color = '#ff6b00';
        setTimeout(() => el.style.color = '', 300);
    };

    // Live Feed Toggle Listener
    const liveToggle = document.getElementById('liveFeedToggle');
    if (liveToggle) {
        liveToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                startSimulation();
                console.log("Live Intel Feed: ACTIVE");
            } else {
                stopSimulation();
                console.log("Live Intel Feed: STANDBY");
            }
        });
    }

    // Animated Counters for Initial Stat Cards
    const animateValue = (id, start, end, duration) => {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const val = progress * (end - start) + start;
            
            if (id === 'count-perf') {
                obj.innerHTML = val.toFixed(1) + '%';
            } else {
                obj.innerHTML = Math.floor(val);
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Trigger animations after a short delay
    setTimeout(() => {
        animateValue("count-employees", 0, 248, 1500);
        animateValue("count-tasks", 0, 134, 1500);
        animateValue("count-perf", 0, 76.4, 1500);
        animateValue("count-attr", 0, 18, 1500);
    }, 500);
});
