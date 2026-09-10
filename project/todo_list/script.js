// Simple Todo app using localStorage
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const listEl = document.getElementById('todo-list');
const countEl = document.getElementById('count');
const clearBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter');

let todos = []; // { id, title, completed }
let filter = 'all';

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function load() {
  try {
    const raw = localStorage.getItem('todos');
    todos = raw ? JSON.parse(raw) : [];
  } catch (e) {
    todos = [];
  }
}

function render() {
  listEl.innerHTML = '';
  const visible = todos.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
  });

  for (const t of visible) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (t.completed ? ' completed' : '');
    li.dataset.id = t.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!t.completed;
    checkbox.addEventListener('change', () => toggleComplete(t.id));

    const label = document.createElement('div');
    label.className = 'label';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = t.title;
    title.tabIndex = 0;

    // double click to edit
    title.addEventListener('dblclick', () => startEdit(t.id, title));
    title.addEventListener('keydown', (e) => { if (e.key === 'Enter') startEdit(t.id, title); });

    label.appendChild(title);

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.title = 'Edit';
    editBtn.textContent = '✏️';
    editBtn.addEventListener('click', () => startEdit(t.id, title));

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.title = 'Delete';
    delBtn.textContent = '🗑️';
    delBtn.addEventListener('click', () => removeTodo(t.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(actions);

    listEl.appendChild(li);
  }

  const left = todos.filter(t => !t.completed).length;
  countEl.textContent = `${left} item${left !== 1 ? 's' : ''} left`;
}

function addTodo(title) {
  const trimmed = title.trim();
  if (!trimmed) return;
  todos.unshift({ id: Date.now().toString(), title: trimmed, completed: false });
  save();
  render();
}

function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

function toggleComplete(id) {
  const t = todos.find(x => x.id === id);
  if (t) t.completed = !t.completed;
  save();
  render();
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  save();
  render();
}

function startEdit(id, titleEl) {
  const t = todos.find(x => x.id === id);
  if (!t) return;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = t.title;

  function finish(saveEdit) {
    if (saveEdit) {
      const val = input.value.trim();
      if (val) t.title = val;
      else removeTodo(id);
    }
    render();
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') finish(true);
    if (e.key === 'Escape') finish(false);
  });
  input.addEventListener('blur', () => finish(true));

  // replace title with input
  titleEl.replaceWith(input);
  input.focus();
  // move cursor to end
  input.selectionStart = input.selectionEnd = input.value.length;
}

// handle filter buttons
filterBtns.forEach(b => b.addEventListener('click', () => {
  filterBtns.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  filter = b.dataset.filter;
  render();
}));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

clearBtn.addEventListener('click', clearCompleted);

// initialize
load();
render();
