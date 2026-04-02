// devices/Device.js - Base device class
export class Device {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.state = this.getDefaultState();
    this.mediator = null;
  }

  getDefaultState() {
    return { power: false };
  }

  setMediator(mediator) {
    this.mediator = mediator;
  }

  notifyChange(changedProperty) {
    if (this.mediator) {
      this.mediator.notify(this, changedProperty);
    }
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyChange(this.state);
  }

  getState() {
    return { ...this.state };
  }
}