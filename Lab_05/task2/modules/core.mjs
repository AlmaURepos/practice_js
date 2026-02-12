export default class TodoApp {
    constructor(){
        this.todos = [];
    }

    addTodo(task){
        this.todos.push(task);
    }

    getTodos(){
        return this.todos;
    }
}