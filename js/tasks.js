document.addEventListener('DOMContentLoaded', () => {
    const taskCards = document.querySelectorAll('.task-card');
    const searchInput = document.getElementById('taskSearch');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const deptFilter = document.getElementById('deptFilter');

    // 1. Expand Card Logic
    taskCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove regular expanded class from others
            taskCards.forEach(c => {
                if (c !== card) c.classList.remove('expanded');
            });
            
            // Toggle expanded state on clicked card
            card.classList.toggle('expanded');
            
            // Subtle pop effect
            card.style.transform = card.classList.contains('expanded') ? 'scale(1.02)' : 'translateY(-2px)';
            setTimeout(() => {
                if (card.classList.contains('expanded')) {
                    card.style.transform = 'scale(1.01)';
                }
            }, 200);
        });
    });

    // 2. Real Filtering Logic
    const filterTasks = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const status = statusFilter ? statusFilter.value : 'all';
        const priority = priorityFilter ? priorityFilter.value.toLowerCase() : 'all';
        const dept = deptFilter ? deptFilter.value.toLowerCase() : 'all';

        taskCards.forEach(card => {
            const title = card.querySelector('h4').innerText.toLowerCase();
            const desc = card.querySelector('p')?.innerText.toLowerCase() || '';
            const cardPriority = card.querySelector('.priority-badge').innerText.toLowerCase();
            const cardDept = card.getAttribute('data-dept')?.toLowerCase() || 'engineering'; // Default for demo
            
            // Note: In our current HTML, status is determined by which column the card is in.
            // For a real app, we'd filter by data attributes. 
            // Here, we'll simulate 'All' vs specific search/priority/dept.
            
            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
            const matchesPriority = priority === 'all' || cardPriority === priority;
            const matchesDept = dept === 'all' || cardDept === dept;

            if (matchesSearch && matchesPriority && matchesDept) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s forwards';
            } else {
                card.style.display = 'none';
            }
        });

        // Update column counts
        updateColumnCounts();
    };

    const updateColumnCounts = () => {
        document.querySelectorAll('.kanban-column').forEach(col => {
            const visibleCards = col.querySelectorAll('.task-card[style*="display: block"]').length;
            const countEl = col.querySelector('.column-count');
            if (countEl) countEl.innerText = visibleCards;
        });
    };

    // Add Listeners
    if (searchInput) searchInput.addEventListener('input', filterTasks);
    if (statusFilter) statusFilter.addEventListener('change', filterTasks);
    if (priorityFilter) priorityFilter.addEventListener('change', filterTasks);
    if (deptFilter) deptFilter.addEventListener('change', filterTasks);

    // Initial setup
    // Add dummy data-dept for filtering demonstration
    taskCards.forEach((card, i) => {
        const depts = ['engineering', 'sales', 'hr', 'design', 'product'];
        card.setAttribute('data-dept', depts[i % depts.length]);
    });

    // Staggered animation triggers
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach((col, index) => {
        col.style.animationDelay = `${(index + 1) * 0.1}s`;
    });

    const cards = document.querySelectorAll('.task-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${0.3 + (index * 0.05)}s`;
    });

    // Initialize counts
    updateColumnCounts();
});
