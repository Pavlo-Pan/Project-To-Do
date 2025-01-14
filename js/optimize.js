document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addNewEntryForm');
    const modal = document.querySelector('.modal');
    const addTaskButton = document.querySelector('.addTask-button');
    const taskList = document.getElementById('tasks');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const tabs = document.querySelectorAll('.tab');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

    const formatDate = date => {
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleString(undefined, options);
    };

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = tasks
            .filter(task => filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'completed' && task.completed))
            .map((task, index) => `
                <li id="task-${index}" class="task-item">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                    <div class="task-date">
                        <span class="${task.completed ? 'completed' : ''}">${task.description}</span>
                        <span>${formatDate(task.date)}</span>
                    </div>
                    <button onclick="deleteTask(${index})">Delete</button>
                </li>
            `).join('');
    };

    const addTask = (description, date, reminder) => {
        tasks.push({ description, date, reminder, completed: false });
        saveTasks();
        renderTasks();
        if (reminder) {
            const delay = new Date(date) - new Date();
            if (delay > 0) setTimeout(() => alert(`Reminder: ${description} is due at ${formatDate(date)}`), delay);
        }
    };

    const toggleTask = index => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    const deleteTask = index => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    const filterTasks = query => {
        const taskItems = document.querySelectorAll('#tasks .task-item');
        taskItems.forEach(item => {
            const text = item.querySelector('span').textContent.toLowerCase();
            item.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    };

    const highlightTasks = query => {
        const taskItems = document.querySelectorAll('#tasks .task-item');
        let found = false;
        taskItems.forEach(item => {
            const text = item.querySelector('span').textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                found = true;
                item.classList.add('highlight');
                setTimeout(() => item.classList.remove('highlight'), 5000);
            }
        });
        if (!found) alert('No matching tasks found.');
    };

    form.addEventListener('submit', event => {
        event.preventDefault();
        const description = document.getElementById('descripionEntry').value;
        const date = document.getElementById('dataEntry').value;
        const reminder = document.querySelector('.switch input').checked;
        if (description && date) {
            addTask(description, date, reminder);
            form.reset();
        }
    });

    addTaskButton.addEventListener('click', () => modal.classList.toggle('hidden'));

    searchInput.addEventListener('input', () => filterTasks(searchInput.value));

    searchButton.addEventListener('click', () => highlightTasks(searchInput.value.trim()));

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTasks(tab.dataset.filter);
        });
    });

    renderTasks();
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
});
