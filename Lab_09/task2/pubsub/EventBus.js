// EventBus.js - reused for task2
export class EventBus {
  constructor() {
    this.events = new Map();
    this.onceEvents = new Map();
  }

  subscribe(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const subscribers = this.events.get(event);
    subscribers.push(callback);

    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  }

  subscribeOnce(event, callback) {
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, []);
    }
    this.onceEvents.get(event).push(callback);
  }

  publish(event, data) {
    if (this.onceEvents.has(event)) {
      const onceCallbacks = this.onceEvents.get(event);
      onceCallbacks.forEach((callback) => callback(data));
      this.onceEvents.delete(event);
    }

    if (this.events.has(event)) {
      this.events.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  clear(event) {
    if (event) {
      this.events.delete(event);
      this.onceEvents.delete(event);
    } else {
      this.events.clear();
      this.onceEvents.clear();
    }
  }

  getSubscriberCount(event) {
    const regular = this.events.get(event)?.length || 0;
    const once = this.onceEvents.get(event)?.length || 0;
    return regular + once;
  }
}

const eventBus = new EventBus();
export default eventBus;