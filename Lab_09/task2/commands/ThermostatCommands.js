// commands/ThermostatCommands.js
import { Command } from "./Command.js";

export class SetTemperatureCommand extends Command {
  constructor(thermostat, temperature) {
    super();
    this.thermostat = thermostat;
    this.temperature = temperature;
    this.previousTemperature = null;
  }

  execute() {
    this.previousTemperature = this.thermostat.state.temperature;
    this.thermostat.setTemperature(this.temperature);
  }

  undo() {
    if (this.previousTemperature !== null) {
      this.thermostat.setTemperature(this.previousTemperature);
    }
  }
}