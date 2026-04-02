// commands/MacroCommand.js
import { Command } from "./Command.js";

export class MacroCommand extends Command {
  constructor(commands) {
    super();
    this.commands = commands;
  }

  execute() {
    this.commands.forEach((command) => command.execute());
  }

  undo() {
    [...this.commands].reverse().forEach((command) => command.undo());
  }
}