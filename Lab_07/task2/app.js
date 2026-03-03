import { NotificationFactory } from "./NotificationFactory.js";

function sendNotification(type, options, message) {
    try {
        const notification = NotificationFactory.create(type, options);
        return notification.send(message);
    } catch (error) {
        console.error("Failed to send notification:", error.message);
        return { success: false, error: error.message };
    }
}

sendNotification("email", { to: "user@example.com", subject: "Hello" }, "Welcome!");
sendNotification("sms", { to: "+1234567890" }, "Your code is 123456");
sendNotification("push", { deviceToken: "abc123", title: "Alert" },"You have a message");