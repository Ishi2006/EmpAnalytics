document.addEventListener('DOMContentLoaded', () => {
    const pendingList = document.getElementById('pendingTasks');
    const inProgressList = document.getElementById('inProgressTasks');
    const completedList = document.getElementById('completedTasks');
    const searchInput = document.querySelector('.toolbar-filters input');
    const addTaskBtn = document.querySelector('.btn-primary');

    let allTasks = [];

    // 1. Fetch and Render
    async function fetchTasks() {
        try {
            const response = await fetch(`${API_BASE}/tasks`);
            if (!response.ok) throw new Error('Failed to retrieve intelligence tasks');
            allTasks = await response.json();
            renderTasks(allTasks);
            updateSummaryStats(allTasks);
        } catch (err) {
            showError(err.message);
        }
    }

    function renderTasks(tasks) {
        // Clear all columns
        [pendingList, inProgressList, completedList].forEach(el => {
            if (el) el.innerHTML = '';
        });

        tasks.forEach(task => {
            const card = createTaskCard(task);
            const status = (task.status || '').toLowerCase();
            if (status === 'pending') pendingList?.appendChild(card);
            else if (status === 'in_progress' || status === 'in progress') inProgressList?.appendChild(card);
            else if (status === 'completed') completedList?.appendChild(card);
        });

        updateColumnCounts();
    }

    function createTaskCard(task) {
        const div = document.createElement('div');
        div.className = 'task-card fade-up';
        div.style.cursor = 'pointer';
        
        const priorityClass = `priority-${(task?.priority || 'Medium').toLowerCase()}`;
        
        div.innerHTML = `
            <h4>${task?.task_name || 'Unnamed Task'}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${task?.description || 'No description provided.'}</p>
            <div class="task-meta">
                <div class="assignee">
                    <div class="assignee-img" style="background: var(--border); color: var(--text-main); font-size: 0.7rem;">OP</div>
                    <span style="font-size: 0.8rem; font-weight: 500;">Operative #${task?.assigned_to || task?.employee_id || '000'}</span>
                </div>
                <span class="priority-badge ${priorityClass}">${task?.priority || 'Medium'}</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">
                <i class="far fa-calendar-alt"></i> Deadline: ${task?.deadline || 'ASA'}
            </div>
        `;

        div.addEventListener('click', () => {
            div.classList.toggle('expanded');
        });

        return div;
    }

    function updateColumnCounts() {
        document.querySelectorAll('.kanban-column').forEach(col => {
            const count = col.querySelectorAll('.task-card').length;
            const countEl = col.querySelector('.column-count');
            if (countEl) countEl.innerText = count;
        });
    }

    function updateSummaryStats(tasks) {
        const total = tasks.length;
        const pending = tasks.filter(t => (t.status || '').toLowerCase() === 'pending').length;
        const inProgress = tasks.filter(t => (t.status || '').toLowerCase().includes('progress')).length;
        const completed = tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length;

        // Use global animateValue if available, otherwise just set text
        if (typeof animateValue === 'function') {
            animateValue("stat-total", 0, total, 1000);
            animateValue("stat-pending", 0, pending, 1000);
            animateValue("stat-in-progress", 0, inProgress, 1000);
            animateValue("stat-completed", 0, completed, 1000);
        } else {
            document.getElementById('stat-total').innerText = total;
            document.getElementById('stat-pending').innerText = pending;
            document.getElementById('stat-in-progress').innerText = inProgress;
            document.getElementById('stat-completed').innerText = completed;
        }
    }

    // 2. Search Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allTasks.filter(t => 
                (t.task_name || '').toLowerCase().includes(query) || 
                (t.description || '').toLowerCase().includes(query)
            );
            renderTasks(filtered);
        });
    }

    // 3. New Task Mock
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            showError("Task deployment requires Commander clearance. Manual override disabled for this session.");
        });
    }

    // Initial Load
    fetchTasks();
});
