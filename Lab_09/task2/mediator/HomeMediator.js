// mediator/HomeMediator.js
import eventBus from "../pubsub/EventBus.js";

export class HomeMediator {
  constructor() {
    this.devices = new Map();
    this.automationRules = [];
  }

  registerDevice(device) {
    this.devices.set(device.name, device);
    device.setMediator(this);
    console.log(`[Mediator] Registered: ${device.name} (${device.type})`);
  }

  unregisterDevice(deviceName) {
    const device = this.devices.get(deviceName);
    if (device) {
      device.setMediator(null);
      this.devices.delete(deviceName);
      console.log(`[Mediator] Unregistered: ${deviceName}`);
    }
  }

  notify(sender, changedProperty) {
    console.log(`[Mediator] ${sender.name} changed:`, changedProperty);

    eventBus.publish("device:change", {
      device: sender.name,
      type: sender.type,
      state: changedProperty
    });

    this.checkAutomationRules(sender, changedProperty);
  }

  getDevice(name) {
    return this.devices.get(name);
  }

  getAllDevices() {
    return Array.from(this.devices.values());
  }

  addRule(condition, action) {
    this.automationRules.push({ condition, action });
  }

  checkAutomationRules(device, state) {
    this.automationRules.forEach((rule) => {
      if (rule.condition(device, state)) {
        rule.action(device, state);
      }
    });
  }
}