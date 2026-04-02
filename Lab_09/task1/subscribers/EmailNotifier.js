import eventBus from "../pubsub/EventBus.js";
export class EmailNotifier {
    constructor(email) {
        this.email = email;
        this.subscriptions = [];
        this.sentCount = 0;
        }
        
        subscribe(categories) {
            categories.forEach(category => {
                const unsubscribe = eventBus.subscribe(`news:${category}`, (
                article) => {
                this.sendEmail(article);
        });

        this.subscriptions.push(unsubscribe);
    });

    console.log(`[Email] Subscribed to: ${categories.join(", ")}`);
    }

    sendEmail(article) {
        this.sentCount++;
        console.log(`[Email-> ${this.email}] Subject: ${article.
        headline}`);
        console.log(` Category: ${article.category} | Priority: ${
        article.priority}`);
        }

    unsubscribe() {
        this.subscriptions.forEach(unsub => unsub());
        this.subscriptions = [];
        console.log(`[Email] Unsubscribed all`);
    }

    getStats() {
        return { sent: this.sentCount, subscriptions: this.
        subscriptions.length };
        }
}