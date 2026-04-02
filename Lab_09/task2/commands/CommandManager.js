// commands/CommandManager.js - Invoker with undo/redo
export class CommandManager {
  constructor() {
    this.history = [];
    this.redoStack = [];
    this.maxHistory = 50;
  }

  execute(command) {
    command.execute();
    this.history.push(command);
    this.redoStack = [];

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  undo() {
    const command = this.history.pop();

    if (command) {
      command.undo();
      this.redoStack.push(command);
      console.log("[CommandManager] Undo performed");
    } else {
      console.log("[CommandManager] Nothing to undo");
    }
  }

  redo() {
    const command = this.redoStack.pop();

    if (command) {
      command.execute();
      this.history.push(command);
      console.log("[CommandManager] Redo performed");
    } else {
      console.log("[CommandManager] Nothing to redo");
    }
  }

  getHistory() {
    return this.history.map((cmd, index) => `${index + 1}. ${cmd.constructor.name}`);
  }

  canUndo() {
    return this.history.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }
}