// mvc/model/TodoModel.js
export class TodoModel {
    constructor() {
        this.todos = [];
        this.observers = [];
    }
    // Observer pattern- subscribe to changes
    subscribe(observer) {
        this.observers.push(observer);
    }
    unsubscribe(observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }
    notify() {
        this.observers.forEach(observer => {
            if (typeof observer === 'function') {
                observer(this.todos);
            } else if (observer.update) {
                observer.update(this.todos);
            }
        });
    }
    // CRUD operations
    addTodo(text) {
        const todo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.todos.push(todo);
        this.notify();
        return todo;
        }
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.notify();
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.notify();
    }

    updateTodo(id, text) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = text;
            this.notify();
        }
    }
    getTodos() {
        return [...this.todos];
    }
    getCompletedCount() {
        return this.todos.filter(t => t.completed).length;
    }
    getPendingCount() {
        return this.todos.filter(t => !t.completed).length;
    }
}