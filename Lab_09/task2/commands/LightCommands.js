// commands/LightCommands.js
import { Command } from "./Command.js";

export class TurnOnLightCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }

  execute() {
    this.light.turnOn();
  }

  undo() {
    this.light.turnOff();
  }
}

export class TurnOffLightCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }

  execute() {
    this.light.turnOff();
  }

  undo() {
    this.light.turnOn();
  }
}

export class SetBrightnessCommand extends Command {
  constructor(light, level) {
    super();
    this.light = light;
    this.newLevel = level;
    this.previousLevel = null;
  }

  execute() {
    this.previousLevel = this.light.state.brightness;
    this.light.setBrightness(this.newLevel);
  }

  undo() {
    if (this.previousLevel !== null) {
      this.light.setBrightness(this.previousLevel);
    }
  }
}