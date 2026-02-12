import TodoApp from "./core.mjs"
import {createElement} from "./utils.mjs"
import * as Constants from "./constants.mjs"


const app = new TodoApp();

document.getElementById('title').textContent = Constants.appTitle;

document.getElementById('addBtn').addEventListener('click', () => {
    const input = document.getElementById('todoInput');
    app.addTodo(input.value);


    const list = document.getElementById('todoList');
    list.appendChild(createElement('li', input.value));
})