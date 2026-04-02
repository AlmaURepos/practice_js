// devices/Thermostat.js
import { Device } from "./Device.js";

export class Thermostat extends Device {
  constructor(name, room) {
    super(name, "thermostat");
    this.room = room;
  }

  getDefaultState() {
    return { power: true, temperature: 22, mode: "auto" };
  }

  setTemperature(value) {
    this.updateState({
      temperature: Math.max(10, Math.min(35, value))
    });
    console.log(`[Thermostat] ${this.name} temperature: ${this.state.temperature}°C`);
  }

  setMode(mode) {
    this.updateState({ mode });
    console.log(`[Thermostat] ${this.name} mode: ${mode}`);
  }

  turnOff() {
    this.updateState({ power: false });
    console.log(`[Thermostat] ${this.name} turned OFF`);
  }

  turnOn() {
    this.updateState({ power: true });
    console.log(`[Thermostat] ${this.name} turned ON`);
  }
}