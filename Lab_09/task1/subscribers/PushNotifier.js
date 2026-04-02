import eventBus from "../pubsub/EventBus.js";

export class PushNotifier {
    constructor(deviceId, outputSelector="#push-log") {
        this.deviceId = deviceId;
        this.subscriptions = [];
        this.sentCount = 0;
        this.output = document.querySelector(outputSelector);
    }

    subscribe(categories) {
        categories.forEach(category => {
            const unsubscribe = eventBus.subscribe(`news:${category}`, (article) => {
                this.sendPush(article);
            });
            this.subscriptions.push(unsubscribe);
        })
        console.log(`[Push] Device ${this.deviceId} subscribed to: ${categories.join(", ")}`);
    }

    sendPush(article) {
        this.sentCount++;
        const line = `[Push-> Device ${this.deviceId}] ${article.headline} [${article.category} | ${article.priority}]`;
        console.log(line);

        if(this.output){
            const item = document.createElement("div");
            item.textContent = line;
            this.output.appendChild(item);
        }
    }

    unsubscribe() {
        this.subscriptions.forEach(unsub => unsub());
        this.subscriptions = [];
        console.log(`[Push] Device ${this.deviceId} unsubscribed all`);
    }

    getStats() {
        return { sent: this.sentCount, subscriptions: this.subscriptions.length };
    }
}

