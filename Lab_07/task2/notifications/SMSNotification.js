 export class SMSNotification {
    constructor(to) {
        this.to = to;
    }
    
    send(message) {
        console.log(`[SMS] To: ${this.to}`);
        console.log(`Message: ${message.slice(0, 160)}`);
        return { success: true, type: "sms" };
}
}