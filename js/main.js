document.addEventListener('DOMContentLoaded', () => {
   // console.log('DOM fully loaded and parsed.');

    const form = document.getElementById('addNewEntryForm');
    if (!form) {
        //console.error('Form not found!');
        return;
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
       // console.log('Form submitted!');

        const description = document.getElementById('descripionEntry');
        const date = document.getElementById('dataEntry');
        const reminder = document.querySelector('#fid-2');

        if (!description || !date || !reminder) {
           // console.error('One of the inputs is missing!');
            return;
        }

       //console.log({
        ////    description: description.value,
       //     date: date.value,
       //     reminder: reminder.checked,
       // });
    });
});

    const todoBody =document.body;
//Page Loaded
window.addEventListener('load', () => {
    todoBody.classList.add('page-loaded')
})

function getCurrentDate() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const day = today.getDate();
    const dayWeek = daysOfWeek[today.getDay()];
    const month = months[today.getMonth()];

    return { dayWeek, day, month };
}

function displayCurrentDate(currentDate) {
    const weekDay = document.querySelector('.header-info h2');
    const monthAndDay = document.querySelector('.header-info p');

    weekDay.textContent = currentDate.dayWeek;
    monthAndDay.textContent = `${currentDate.day} ${currentDate.month}`;
}

function startApp() {
    displayCurrentDate(getCurrentDate());

    function formatDate(dateString) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0'); // Часы
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Минуты
    
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    }

    const modal = document.querySelector('.modal'); // Модальное окно
    const addTaskButton = document.querySelector('.addTask-button'); // Кнопка для добавления задачи
    const taskList = document.getElementById('tasks');
    const form = document.getElementById('addNewEntryForm');
    const allTasksTab = document.getElementById('allTasks');
    const activeTasksTab = document.getElementById('activeTasks');
    const completedTasksTab = document.getElementById('completedTasks');
    const resetBtn = document.getElementById('resetBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let deleteTimeouts = {}; // Объект для хранения таймеров удаления

    // Переключение видимости модального окна
    addTaskButton.addEventListener('click', () => {
        modal.classList.toggle('hidden'); // Добавляет/удаляет класс "hidden"
        addTaskButton.classList.toggle('hidden');
    });

    resetBtn.addEventListener('click', () => {
        modal.classList.toggle('hidden'); // Добавляет/удаляет класс "hidden"
        addTaskButton.classList.toggle('hidden');
    });

    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
        function addTask(description, date, reminder) {
            const task = { description, date, reminder, completed: false };
            tasks.push(task);
            saveTasksToLocalStorage();
            renderTasks();
        
            if (reminder) {
                const now = new Date();
                const taskTime = new Date(date);
                const timeUntilNotification = taskTime - now;
        
                //console.log({ now, taskTime, timeUntilNotification });
        
                if (timeUntilNotification > 0) {
                    //console.log(`Scheduling alert in ${timeUntilNotification} milliseconds.`);
                    setTimeout(() => {
                        alert(`Reminder: ${description} is due at ${formatDate(date)}`);
                    }, timeUntilNotification);
                } else {
                    //console.error('The date and time must be in the future.');
                }
            }
        }
        

    function deleteTask(index) {
        const taskItem = document.getElementById(`task-${index}`);
        const undoButton = document.createElement('button');
        const countdownSpan = document.createElement('span');

        undoButton.textContent = 'Undo';
        undoButton.classList.add('undo-button');
        countdownSpan.textContent = ' (3s)';
        countdownSpan.style.marginLeft = '10px';

        // Скрываем задачу и показываем кнопку "Undo" с таймером
        taskItem.innerHTML = '';
        taskItem.classList.add('undo-mode'); // Добавляем класс для центрации
        taskItem.appendChild(undoButton);
        taskItem.appendChild(countdownSpan);

        let countdown = 3; // Начальное время ожидания
        const intervalId = setInterval(() => {
            countdown -= 1;
            countdownSpan.textContent = ` (${countdown}s)`;
        }, 1000);

        // Устанавливаем таймер на удаление
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId); // Останавливаем таймер обратного отсчета
            tasks.splice(index, 1); // Удаляем задачу из массива
            saveTasksToLocalStorage();
            renderTasks(); // Обновляем список задач
        }, 3000);

        // Сохраняем таймеры в объекте
        deleteTimeouts[index] = { timeoutId, intervalId };

        // Обработчик для кнопки "Undo"
        undoButton.addEventListener('click', () => {
            clearTimeout(deleteTimeouts[index].timeoutId); // Останавливаем таймер удаления
            clearInterval(deleteTimeouts[index].intervalId); // Останавливаем таймер обратного отсчета
            delete deleteTimeouts[index]; // Удаляем из объекта
            renderTasks(); // Перерисовываем задачи
        });
    }


    function toggleTaskCompletion(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasksToLocalStorage();
        renderTasks();
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = ''; // Очищаем список задач
        tasks
            .filter(task => {
                if (filter === 'all') return true;
                if (filter === 'active') return !task.completed;
                if (filter === 'completed') return task.completed;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.id = `task-${index}`;
                taskItem.className = 'task-item';

                // Чекбокс для переключения завершения
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.addEventListener('change', () => toggleTaskCompletion(index));

                // Создаём контейнер для даты и содержимого задачи
                const taskDateContainer = document.createElement('div');
                taskDateContainer.className = 'task-date';
                taskDateContainer.textContent = formatDate(task.date); // Форматируем дату

                // Создаём контейнер для текста задачи
                const taskContent = document.createElement('div');
                taskContent.className = 'task-content';

                // Создаём элемент для текста задачи
                const taskDescription = document.createElement('span');
                taskDescription.textContent = task.description;
                if (task.completed) {
                    taskDescription.classList.add('completed');
                }

                // Добавляем текст задачи в контейнер содержимого
                taskContent.appendChild(taskDescription);
                taskDateContainer.appendChild(taskContent); // Добавляем содержимое внутрь даты

                // Кнопка удаления
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteTask(index));

                // Добавляем элементы в основной элемент задачи
                taskItem.appendChild(checkbox); // Чекбокс
                taskItem.appendChild(taskDateContainer); // Дата задачи с содержимым
                taskItem.appendChild(deleteButton); // Кнопка удаления

                // Добавляем задачу в список задач
                taskList.appendChild(taskItem);
            });
    }

    // Обработчик добавления новой задачи
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
    // Функция для переключения активного класса вкладок
    function setActiveTab(activeTab) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active')); // Удаляем "active" у всех
        activeTab.classList.add('active'); // Добавляем "active" для текущей вкладки
    }
    // Обработчики фильтрации
    allTasksTab.addEventListener('click', () => {
        renderTasks('all');
        setActiveTab(allTasksTab);
    });
    activeTasksTab.addEventListener('click', () => {
        renderTasks('active');
        setActiveTab(activeTasksTab);
    });
    completedTasksTab.addEventListener('click', () => {
        renderTasks('completed');
        setActiveTab(completedTasksTab);
    });

    function setActiveTab(activeTab) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }

    
    // Создаем SVG-элемент
const svgIconHTML = `
<svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.08331 8.1275L1.95581 5L0.890808 6.05751L5.08331 10.25L14.0833 1.25L13.0258 0.192505L5.08331 8.1275Z" fill="#1D192B"></path>
</svg>
`;

// Добавляем обработчики на кнопки
document.querySelectorAll('.tab').forEach(button => {
button.addEventListener('click', () => {
    // Убираем SVG из всех кнопок
    document.querySelectorAll('.tab svg').forEach(svg => svg.remove());

    // Убираем класс active у всех кнопок
    document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));

    // Добавляем класс active к текущей кнопке
    button.classList.add('active');

    // Добавляем SVG внутрь активной кнопки (например, после текста)
    button.insertAdjacentHTML('afterbegin', svgIconHTML);
});
});

// Инициализация для активной кнопки
const activeButton = document.querySelector('.tab.active');
if (activeButton) {
activeButton.insertAdjacentHTML('afterbegin', svgIconHTML);
}

document.addEventListener('DOMContentLoaded', () => {
   // console.log('DOM fully loaded and parsed.');

    const form = document.getElementById('addNewEntryForm');
    const radioButtons = document.querySelectorAll('input[name="radio"]'); // Группа радио-кнопок
    let reminder = false; // По умолчанию выключен

    // Добавляем слушатель событий на изменение состояния радио-кнопок
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            reminder = document.querySelector('input[name="radio"]:checked').value === 'on';
           // console.log('Reminder updated:', reminder); // Лог для проверки
        });
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        //console.log('Form submitted!');

        const description = document.getElementById('descripionEntry').value;
        const date = document.getElementById('dataEntry').value;

        if (!description || !date) {
            //console.error('Description and date are required!');
            return;
        }

      //  console.log({
      //      description,
       //     date,
      //      reminder, // Текущее состояние переключателя
       // });

        addTask(description, date, reminder);
        form.reset();
        reminder = false; // Сбрасываем состояние после отправки
        document.getElementById('fid-1').checked = true; // Устанавливаем переключатель в "off"
    });
});
    renderTasks(); // Рендер начальных задач

    // Объявляем глобальные функции для использования в событиях кнопок
    window.toggleTask = toggleTaskCompletion;
    window.deleteTask = deleteTask;
}

startApp();

// Функция для поиска задач
function filterTasks(query) {
    const taskItems = document.querySelectorAll('#tasks .task-item'); // Все элементы списка задач
    taskItems.forEach(item => {
        const taskDescription = item.querySelector('.task-content span').textContent.toLowerCase();
        if (taskDescription.includes(query.toLowerCase())) {
            item.style.display = ''; // Показываем задачу, если она соответствует запросу
        } else {
            item.style.display = 'none'; // Скрываем задачу
        }
    });
}

// Добавляем обработчик для поиска
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', event => {
    const query = event.target.value; // Получаем текст из input
    filterTasks(query); // Вызываем фильтрацию
});

function highlightTasks(query) {
    const taskItems = document.querySelectorAll('#tasks .task-item');
    let found = false; // Флаг для отслеживания, есть ли совпадения

    taskItems.forEach(item => {
        const taskDescription = item.querySelector('.task-content span').textContent.toLowerCase();
        if (taskDescription.includes(query.toLowerCase())) {
            found = true; // Устанавливаем, что совпадение найдено
            item.classList.add('highlight'); // Добавляем класс подсветки
            setTimeout(() => {
                item.classList.remove('highlight'); // Убираем подсветку через 5 секунд
            }, 5000);
        }
    });

    if (!found) {
        alert('No matching tasks found.'); // Уведомление, если совпадений нет
    }
}

// Добавляем обработчик на кнопку поиска
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', () => {
    const query = document.getElementById('search').value.trim(); // Получаем текст из input
    if (query) {
        highlightTasks(query); // Вызываем подсветку задач
    } else {
        alert('Please enter a search term.'); // Уведомление, если поле пустое
    }
});