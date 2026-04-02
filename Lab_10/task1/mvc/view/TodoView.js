export class TodoView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.onAddTodo = null;
        this.onToggleTodo = null;
        this.onDeleteTodo = null;
        this.onEditTodo = null;
     }

    render(todos) {
        const completedCount = todos.filter(t => t.completed).length;
        const pendingCount = todos.filter(t => !t.completed).length;
        this.container.innerHTML = `
            <div class="todo-app">
            <h1>Todo MVC Application</h1>
            <div class="todo-stats">
                <span>Total: ${todos.length}</span>
                <span>Completed: ${completedCount}</span>
                <span>Pending: ${pendingCount}</span>
            </div>
            <form class="todo-form" id="addForm">
                <input type="text" id="todoInput" placeholder="Add a new todo..." required />
                <button type="submit">Add</button>
            </form>
            <ul class="todo-list">
                ${todos.map(todo => `
                    <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                        <input type="checkbox" class="todo-toggle"
                        ${todo.completed ? 'checked' : ''}
                        data-action="toggle"
                        />
                        <span class="todo-text" data-action="edit">${todo.text}</span>
                        <button class="todo-delete" data-action="delete">Delete</button>
                    </li>
                `).join('')}
            </ul>
        </div>
        `;
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Form submission
        const form = this.container.querySelector('#addForm');
        form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('#todoInput');
        if (input.value.trim() && this.onAddTodo) {
        this.onAddTodo(input.value.trim());
        input.value = '';
}
    });
    // Event delegation for list items
    const list = this.container.querySelector('.todo-list');
    list.addEventListener('click', (e) => {
    const item = e.target.closest('.todo-item');
    if (!item) return;
    const id = parseInt(item.dataset.id);
    const action = e.target.dataset.action;
    if (action === 'toggle' && this.onToggleTodo) {
        this.onToggleTodo(id);
    } else if (action === 'delete' && this.onDeleteTodo) {
        this.onDeleteTodo(id);
    } else if (action === 'edit' && this.onEditTodo) {
        this.startEditing(item, id);
    }
    });
    }
    startEditing(item, id) {
        const textSpan = item.querySelector('.todo-text');
        const currentText = textSpan.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';
        textSpan.replaceWith(input);
        input.focus();
        const finishEdit = () => {
        const newText = input.value.trim();
        if (newText && this.onEditTodo) {
            this.onEditTodo(id, newText);
        }
    };
    
    input.addEventListener('blur', finishEdit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') {
        input.value = currentText;
        input.blur();
        }
    });
    }
}