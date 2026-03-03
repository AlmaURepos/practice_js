
// config.js- Module-based Singleton
const config = {};


export default {
    get(key) {
        return config[key];
    },

    set(key, value) {
        config[key] = value;
    },

    getAll() {
        return { ...config };
    }
};