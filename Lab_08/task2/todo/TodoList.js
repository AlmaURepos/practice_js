// TodoList.js-Todo list with event delegation
import { EventDelegator } from "../delegate/EventDelegator.js";

export class TodoList {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.items = new Map();
        this.idCounter = 0;
        this.delegator = new EventDelegator(`#${containerId}`);
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.delegator.on("toggle", ({ id, completed }) => {
            this.toggleItem(id, completed);
        });

        this.delegator.on("delete", ({ id }) => {
            this.deleteItem(id);
        });
        
        this.delegator.on("edit", ({ id }) => {
            this.startEditing(id);
        });

        this.delegator.on("priority", ({ id, priority }) => {
            this.setPriority(id, priority);
        });

        this.delegator.on("edit-start", ({ id }) => {
            this.startEditing(id);
        });
    }

    addItem(text, priority = "normal") {
        const id = `todo-${++this.idCounter}`;
        const item = { id, text, completed: false, priority, editing: false };
        this.items.set(id, item);
        this.renderItem(item);
        return id;
    }
    
    renderItem(item) {
        const div = document.createElement("div");
        div.className = `todo-item ${item.completed ? "completed" : ""}
        priority-${item.priority}`;
        div.dataset.id = item.id;
        div.innerHTML = 
            `
                <input type="checkbox" data-action="toggle" ${item.completed
                ? "checked" : ""}>
                <span class="todo-text">${item.text}</span>
                <div class="todo-actions">
                <button data-action="priority" data-priority="high">High</
                button>
                53 <button data-action="priority" data-priority="normal">
                Normal</button>
                <button data-action="priority" data-priority="low">Low</
                button>
                <button data-action="edit">Edit</button>
                <button data-action="delete">Delete</button>
                </div>
            `;

        this.container.appendChild(div);
    }
    
    toggleItem(id, completed) {
        const item = this.items.get(id);
        if (item) {
            item.completed = completed;
            const element = this.container.querySelector(`[data-id="${id}"]`);
            element.classList.toggle("completed", completed);
            element.querySelector('input[type="checkbox"]').checked = completed;
        }
    }
    
    deleteItem(id) {
        this.items.delete(id);
        const element = this.container.querySelector(`[data-id="${id}"]`);
        element.remove();
    }
    
    setPriority(id, priority) {
        const item = this.items.get(id);
        if (item) {
            item.priority = priority;
            const element = this.container.querySelector(`[data-id="${id}"]`);
            element.className = `todo-item ${item.completed ? "completed": ""} priority-${priority}`;
        }
    }

    startEditing(id) {
        const item = this.items.get(id);
        if (!item) return;
            const element = this.container.querySelector(`[data-id="${id}"]`);
            const textSpan = element.querySelector(".todo-text");
            const input = document.createElement("input");
            input.type = "text";
            input.value = item.text;
            input.className = "edit-input";
            input.addEventListener("blur", () => {
                item.text = input.value;
                textSpan.textContent = item.text;
                input.replaceWith(textSpan);
            });
            input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") input.blur();
            if (e.key === "Escape") {
                input.value = item.text;
                input.blur();
                }});
    
            textSpan.replaceWith(input);
            input.focus();
    }
    
    generateItems(count = 1000) {
        const priorities = ["high", "normal", "low"];
        for (let i = 1; i <= count; i++) {
            this.addItem(`Task #${i}`, priorities[i % 3]);
        }
    }
}