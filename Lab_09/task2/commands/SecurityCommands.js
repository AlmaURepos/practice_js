// commands/SecurityCommands.js
import { Command } from "./Command.js";

export class ArmSecurityCommand extends Command {
  constructor(securitySystem) {
    super();
    this.securitySystem = securitySystem;
  }

  execute() {
    this.securitySystem.arm();
  }

  undo() {
    this.securitySystem.disarm();
  }
}

export class DisarmSecurityCommand extends Command {
  constructor(securitySystem) {
    super();
    this.securitySystem = securitySystem;
  }

  execute() {
    this.securitySystem.disarm();
  }

  undo() {
    this.securitySystem.arm();
  }
}