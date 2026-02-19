'use strict';


class TaskBoard {
  constructor() {
    this.cards = [
      { id: 1, title: 'Design login page', column: 'TODO' },
      { id: 2, title: 'Fix auth bug', column: 'TODO' }
    ];
  }

  moveCard(id, toColumn) {
    const card = this.cards.find(c => c.id === id);
    if (card) {
      card.column = toColumn;
    }
  }

  renameCard(id, newTitle) {
    const card = this.cards.find(c => c.id === id);
    if (card) {
      card.title = newTitle;
    }
  }

  printBoard() {
    console.log(JSON.stringify(this.cards, null, 2));
  }
}

class MoveCardCommand {
  constructor(board, id, fromColumn, toColumn) {
    this.board = board;
    this.id = id;
    this.fromColumn = fromColumn;
    this.toColumn = toColumn;
  }

  execute() {
    this.board.moveCard(this.id, this.toColumn);
  }

  undo() {
    this.board.moveCard(this.id, this.fromColumn);
  }
}


class RenameCardCommand {
  constructor(board, id, oldTitle, newTitle) {
    this.board = board;
    this.id = id;
    this.oldTitle = oldTitle;
    this.newTitle = newTitle;
  }

  execute() {
    this.board.renameCard(this.id, this.newTitle);
  }

  undo() {
    this.board.renameCard(this.id, this.oldTitle);
  }
}


class ActionHistory {
  constructor() {
    this._history = [];
    this._redoStack = [];
  }

  execute(command) {
    command.execute();
    this._history.push(command);
    this._redoStack = [];
  }

  undo() {
    const command = this._history.pop();
    if (command) {
      command.undo();
      this._redoStack.push(command);
    }
  }

  redo() {
    const command = this._redoStack.pop();
    if (command) {
      command.execute();
      this._history.push(command);
    }
  }
}


const board = new TaskBoard();
const history = new ActionHistory();

history.execute(new MoveCardCommand(board, 1, 'TODO', 'IN PROGRESS'));
history.execute(new RenameCardCommand(board, 2, 'Fix auth bug', 'Fix OAuth2 bug'));

console.log('[SCENARIO_05] After actions:');
board.printBoard();

history.undo();
console.log('[SCENARIO_05] After undo:');
board.printBoard();

history.redo();
console.log('[SCENARIO_05] After redo:');
board.printBoard();
