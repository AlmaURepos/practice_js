import ConfigManager from "./singleton.js";


const instance1 = ConfigManager.getInstance();

const instance2 = ConfigManager.getInstance();

console.log("Same instance:", instance1 === instance2); // true
instance1.set("appName", "MyApp");
console.log("From instance2:", instance2.get("appName")); // "MyApp