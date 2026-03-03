class ConfigManager {
    constructor() {
        if (ConfigManager.instance) {return ConfigManager.instance;}
        this.config = {};
        ConfigManager.instance = this;
    }
    
    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
    }

    getAll() {
        return { ...this.config };
    }

    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
}

export default ConfigManager;