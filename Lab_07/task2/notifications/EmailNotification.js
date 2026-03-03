
export class EmailNotification {
    constructor(to, subject) {
        this.to = to;
        this.subject = subject;
    }

    send(message) {
        console.log(`[EMAIL] To: ${this.to}, Subject: ${this.subject}`)
        console.log(`Message: ${message}`);
        return { success: true, type: "email" };
}
}