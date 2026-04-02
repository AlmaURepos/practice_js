 // mvc/controller/TodoController.js
import { TodoModel } from '../model/TodoModel.js';
import { TodoView } from '../view/TodoView.js';
export class TodoController {
    constructor(containerId) {
        this.model = new TodoModel();
        this.view = new TodoView(containerId);
        // Connect View events to Controller
        this.view.onAddTodo = (text) => this.addTodo(text);
        this.view.onToggleTodo = (id) => this.toggleTodo(id);
        this.view.onDeleteTodo = (id) => this.deleteTodo(id);
        this.view.onEditTodo = (id, text) => this.updateTodo(id, text);
        this.model.subscribe((todos) => this.view.render(todos));
        // Initial render
        this.view.render(this.model.getTodos());
    }
    
    addTodo(text) {
        this.model.addTodo(text);
    }

    toggleTodo(id) {
        this.model.toggleTodo(id);
    }
    
    deleteTodo(id) {
        this.model.deleteTodo(id);
    }

    updateTodo(id, text) {
        this.model.updateTodo(id, text);
    }
}