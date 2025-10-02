document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const themeToggle = document.getElementById('theme-toggle');
  const themeStylesheet = document.getElementById('theme-stylesheet');
  const totalTasks = document.getElementById('total-tasks');
  const completedTasks = document.getElementById('completed-tasks');
  const filterButtons = document.querySelectorAll('.filter-button');

  // загрузка задач и темы из localStorage
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  let currentFilter = 'all';
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.className = savedTheme;
  themeStylesheet.href = savedTheme === 'dark' ? 'assets/css/dark.css' : '';
  themeStylesheet.disabled = savedTheme === 'light';
  themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-moon"></i> Тёмная тема' : '<i class="fas fa-sun"></i> Светлая тема';

  // отрисовка списка задач
  function renderTodos() {
    todoList.innerHTML = '';
    const filteredTodos = todos.filter((todo) => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true;
    });

    filteredTodos.forEach((todo) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <div class="todo-content">
          <button class="check-button"><i class="fas ${todo.completed ? 'fa-check-square' : 'fa-square'}"></i></button>
          ${todo.isEditing ? `
            <input type="text" value="${todo.text}" class="edit-input">
          ` : `
            <span>${todo.text}</span>
          `}
        </div>
        <div class="todo-actions">
          <button class="edit-button"><i class="fas fa-edit"></i> ${todo.isEditing ? 'Сохранить' : 'Редактировать'}</button>
          <button class="delete-button"><i class="fas fa-trash"></i> Удалить</button>
        </div>
      `;

      // обработчик клика по галочке
      const checkButton = li.querySelector('.check-button');
      checkButton.addEventListener('click', () => {
        toggleTodo(todo.id);
      });

      // обработчик клика по тексту задачи
      const span = li.querySelector('span');
      if (span) {
        span.addEventListener('click', () => {
          toggleTodo(todo.id);
        });
      }

      // обработчик редактирования
      const editButton = li.querySelector('.edit-button');
      editButton.addEventListener('click', () => {
        if (todo.isEditing) {
          const input = li.querySelector('.edit-input');
          const newText = input.value.trim();
          if (newText) {
            editTodo(todo.id, newText);
          }
        } else {
          toggleEdit(todo.id);
        }
      });

      // обработчик удаления
      const deleteButton = li.querySelector('.delete-button');
      deleteButton.addEventListener('click', () => {
        deleteTodo(todo.id);
      });

      todoList.appendChild(li);
    });

    // обновление счётчика
    totalTasks.textContent = todos.length;
    completedTasks.textContent = todos.filter((todo) => todo.completed).length;
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  // добавление задачи
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
      todos.push({ id: Date.now(), text, completed: false, isEditing: false });
      todoInput.value = '';
      renderTodos();
    } else {
      alert('Задача не может быть пустой!');
    }
  });

  // переключение состояния задачи
  function toggleTodo(id) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    renderTodos();
  }

  // переключение режима редактирования
  function toggleEdit(id) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
    );
    renderTodos();
  }

  // редактирование задачи
  function editTodo(id, newText) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
    );
    renderTodos();
  }

  // удаление задачи
  function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
  }

  // переключение темы
  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.className === 'light' ? 'dark' : 'light';
    document.body.className = newTheme;
    themeStylesheet.href = newTheme === 'dark' ? 'assets/css/dark.css' : '';
    themeStylesheet.disabled = newTheme === 'light';
    themeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i> Тёмная тема' : '<i class="fas fa-sun"></i> Светлая тема';
    localStorage.setItem('theme', newTheme);
  });

  // фильтры
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.dataset.filter;
      renderTodos();
    });
  });

  // начальная отрисовка
  renderTodos();
});