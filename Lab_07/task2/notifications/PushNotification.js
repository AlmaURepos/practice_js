export class PushNotification {
    constructor(deviceToken, title) {
        this.deviceToken = deviceToken;
        this.title = title;
}

send(message) {
    console.log(`[PUSH] Device: ${this.deviceToken}, Title: ${this.title}`);
    console.log(`Message: ${message}`);
    return { success: true, type: "push" };
}
}