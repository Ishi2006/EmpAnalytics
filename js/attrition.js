document.addEventListener('DOMContentLoaded', () => {
    // Global Chart Defaults for Dark Theme
    Chart.defaults.color = '#a1a1aa';
    Chart.defaults.font.family = 'Outfit';

    const riskTableBody = document.getElementById('riskTableBody');
    const riskBannerText = document.getElementById('risk-banner-text');

    async function initAttritionIntelligence() {
        try {
            const [empRes, perfRes] = await Promise.all([
                fetch(`${API_BASE}/employees`),
                fetch(`${API_BASE}/performance`)
            ]);

            if (!empRes.ok || !perfRes.ok) throw new Error('Intelligence link failure');
            
            const employees = await empRes.json();
            const performance = await perfRes.json();

            // 1. Process and Categorize
            const fullData = employees.map(emp => {
                const perf = performance.find(p => p.employee_id === emp.employee_id);
                const score = perf ? perf.score : 3; // Default to 3 if missing
                
                // MOCK TENURE: (ID based simulation)
                const tenure = (emp.employee_id % 4) + 0.5 + (Math.random() * 0.5);
                
                // RISK SCORE CALCULATION:
                // Lower performance (> risk), lower tenure (> risk), higher salary impact
                let riskScore = (6 - score) * 15; // 1 -> 75, 5 -> 15
                if (tenure < 1.5) riskScore += 15;
                riskScore += Math.floor(Math.random() * 10); // Noise

                let level = 'LOW';
                if (score <= 2) level = 'HIGH';
                else if (score === 3) level = 'MEDIUM';

                return { ...emp, score, tenure: tenure.toFixed(1), riskScore, level };
            });

            // 2. Update Dashboard UI
            updateRiskMetrics(fullData);
            
            // 3. Render Table
            renderRiskTable(fullData);
            
            // 4. Render Chart (Mocked based on categories)
            renderDriversChart();

        } catch (err) {
            console.error("Attrition Init Error:", err);
            showError(err.message);
        }
    }

    function updateRiskMetrics(data) {
        const high = data.filter(e => e.level === 'HIGH').length;
        const medium = data.filter(e => e.level === 'MEDIUM').length;
        const low = data.filter(e => e.level === 'LOW').length;

        // Banner
        if (riskBannerText) {
            riskBannerText.innerHTML = `<i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i> ${high} employees are currently flagged as High Risk. Immediate HR intervention recommended.`;
        }

        // Stat Cards (using global animateValue if exists)
        if (typeof animateValue === 'function') {
            animateValue("stat-high-risk", 0, high, 800);
            animateValue("stat-medium-risk", 0, medium, 800);
            animateValue("stat-low-risk", 0, low, 800);
        } else {
            document.getElementById('stat-high-risk').innerText = high;
            document.getElementById('stat-medium-risk').innerText = medium;
            document.getElementById('stat-low-risk').innerText = low;
        }
    }

    function renderRiskTable(data) {
        if (!riskTableBody) return;

        riskTableBody.innerHTML = data.map((emp, index) => {
            const riskClass = emp.level.toLowerCase();
            const accentColor = emp.level === 'HIGH' ? 'var(--danger)' : (emp.level === 'MEDIUM' ? 'var(--warning)' : 'var(--success)');
            const actionText = emp.level === 'HIGH' ? 'Intervene' : (emp.level === 'MEDIUM' ? 'Monitor' : 'No Action');

            return `
                <tr class="${emp.level === 'HIGH' ? 'row-high-risk' : ''} fade-up" style="animation-delay: ${0.2 + (index * 0.1)}s">
                    <td style="font-weight: 600;">${emp.employee_name}</td>
                    <td>${emp.dept}</td>
                    <td>${emp.tenure} yrs</td>
                    <td>₹${emp.salary.toLocaleString()}</td>
                    <td>${emp.score * 20}%</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="risk-score-bar-container">
                                <div class="risk-score-bar" style="width: ${emp.riskScore}%; background: ${accentColor};"></div>
                            </div>
                            <span>${emp.riskScore}</span>
                        </div>
                    </td>
                    <td><span class="risk-status-badge risk-${riskClass}">${emp.level}</span></td>
                    <td>
                        <button class="btn" onclick="showError('Retention sequence initiated for ${emp.employee_name}. Operational logs updated.')" style="padding: 4px 12px; font-size: 0.8rem; background: ${accentColor}; color: white; border: none; cursor: pointer;">
                            ${actionText}
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderDriversChart() {
        const driversCtx = document.getElementById('driversChart');
        if (!driversCtx) return;

        new Chart(driversCtx, {
            type: 'bar',
            data: {
                labels: ['Work-Life Balance', 'Low Compensation', 'Limited Growth', 'Overwork', 'Manager Conflict', 'Long Commute'],
                datasets: [{
                    label: 'Severity Score',
                    data: [82, 74, 68, 61, 55, 43],
                    backgroundColor: '#ff6b00',
                    borderRadius: 6,
                    barThickness: 24
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, max: 100, grid: { color: '#27272a' }, ticks: { color: '#a1a1aa' } },
                    y: { grid: { display: false }, ticks: { color: '#ffffff' } }
                }
            }
        });
    }

    initAttritionIntelligence();
});
