// devices/SecuritySystem.js
import { Device } from "./Device.js";

export class SecuritySystem extends Device {
  constructor(name, zone) {
    super(name, "security");
    this.zone = zone;
  }

  getDefaultState() {
    return { power: true, armed: false, alarm: false };
  }

  arm() {
    this.updateState({ armed: true, alarm: false });
    console.log(`[Security] ${this.name} armed`);
  }

  disarm() {
    this.updateState({ armed: false, alarm: false });
    console.log(`[Security] ${this.name} disarmed`);
  }

  triggerAlarm() {
    this.updateState({ alarm: true });
    console.log(`[Security] ${this.name} alarm TRIGGERED`);
  }

  resetAlarm() {
    this.updateState({ alarm: false });
    console.log(`[Security] ${this.name} alarm reset`);
  }
}