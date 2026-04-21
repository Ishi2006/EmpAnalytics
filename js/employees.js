document.addEventListener('DOMContentLoaded', () => {
    const employees = [
        { id: 1, name: 'Ava Simmons', role: 'Senior Developer', dept: 'Engineering', status: 'Active', perf: '4.8', last: '2h ago' },
        { id: 2, name: 'Liam Wilson', role: 'UI/UX Designer', dept: 'Product', status: 'On Leave', perf: '4.5', last: '1d ago' },
        { id: 3, name: 'Sophia Miller', role: 'Marketing Lead', dept: 'Marketing', status: 'Active', perf: '4.2', last: '5m ago' },
        { id: 4, name: 'James Brown', role: 'Backend Engineer', dept: 'Engineering', status: 'Remote', perf: '4.6', last: '15m ago' },
        { id: 5, name: 'Isabella Davis', role: 'Product Manager', dept: 'Product', status: 'Active', perf: '4.9', last: '30m ago' },
        { id: 6, name: 'Oliver Taylor', role: 'Sales rep', dept: 'Sales', status: 'Active', perf: '3.8', last: '4h ago' }
    ];

    const tableBody = document.getElementById('employeeTableBody');
    
    function renderEmployees(data) {
        if (!tableBody) return;
        tableBody.innerHTML = data.map(emp => `
            <tr style="border-bottom: 1px solid var(--border); transition: var(--transition); cursor: default;" 
                onmouseover="this.style.background='rgba(255, 107, 0, 0.05)'" 
                onmouseout="this.style.background='transparent'">
                <td style="padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="user-avatar" style="width: 35px; height: 35px; font-size: 0.8rem; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 700;">
                            ${emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <p style="font-weight: 600; font-size: 0.95rem; color: #ffffff;">${emp.name}</p>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">${emp.role}</p>
                        </div>
                    </div>
                </td>
                <td style="padding: 1rem; font-size: 0.9rem; color: #ffffff;">${emp.dept}</td>
                <td style="padding: 1rem;">
                    <span style="background: ${emp.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 107, 0, 0.1)'}; 
                                 color: ${emp.status === 'Active' ? '#22c55e' : 'var(--primary)'}; 
                                 padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                        ${emp.status}
                    </span>
                </td>
                <td style="padding: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="flex: 1; height: 6px; background: var(--border); border-radius: 3px; max-width: 60px; overflow: hidden;">
                            <div style="width: ${emp.perf * 20}%; height: 100%; background: var(--primary); border-radius: 3px;"></div>
                        </div>
                        <span style="font-weight: 600; font-size: 0.9rem; color: #ffffff;">${emp.perf}</span>
                    </div>
                </td>
                <td style="padding: 1rem; font-size: 0.85rem; color: var(--text-muted);">${emp.last}</td>
                <td style="padding: 1rem;">
                    <button class="btn" style="padding: 5px 10px; background: transparent; color: var(--text-muted); border: none; cursor: pointer;"><i class="fas fa-ellipsis-v"></i></button>
                </td>
            </tr>
        `).join('');
    }

    renderEmployees(employees);

    // Search filtering
    const searchInput = document.getElementById('employeeSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = employees.filter(emp => 
                emp.name.toLowerCase().includes(query) || 
                emp.role.toLowerCase().includes(query) ||
                emp.dept.toLowerCase().includes(query)
            );
            renderEmployees(filtered);
        });
    }
});
