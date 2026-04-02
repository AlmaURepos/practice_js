import eventBus from "../pubsub/EventBus.js";

export class DashboardWidget{
    constructor(widgetName, outputSelector="#dashboard-feed") {
        this.widgetName = widgetName;
        this.subscriptions = [];
        this.receivedCount = 0;
        this.output = document.querySelector(outputSelector);
    }

    subscribe(categories) { 
        categories.forEach(category => {
            const unsubscribe = eventBus.subscribe(`news:${category}`, (article) => {
                this.renderArticle(article);
            });
            this.subscriptions.push(unsubscribe);
        })
        console.log(`[Dashboard] Widget "${this.widgetName}" subscribed to: ${categories.join(", ")}`);
    }

    renderArticle(article) {    
        this.receivedCount++;

        if (!this.output) return;

        const card = document.createElement("div");
        card.className =   `new_card priority-${article.priority}`;

        card.innerHTML = `
            <h3>${article.headline}</h3>
            <p><strong>Category:</strong> ${article.category} | <strong>Source:</strong> ${article.source} | <strong>Priority:</strong> ${article.priority}</p>
            <p>${article.content}</p>
            <small>${new Date(article.timestamp).toLocaleString()}</small>
        `;
        this.output.appendChild(card);
    }

    unsubscribe() {
        this.subscriptions.forEach(unsub => unsub());
        this.subscriptions = [];
        console.log(`[Dashboard] Widget "${this.widgetName}" unsubscribed all`);
    }

    getStats() {
        return { received: this.receivedCount, subscriptions: this.subscriptions.length };
    }
}