class AppConfig{
    constructor(){
        if(AppConfig._instance){
            return AppConfig._instance;
        }

        this.settings = {
            apiBaseUrl: 'https://api.example.com',
            locale: 'kz-KZ',
            featureFlags: {darkMode: true, betaFeatures: false}
        }

        AppConfig._instance = this;
    }


    get(key){
        return this.settings[key];
    }

    set(key, value){
        this.settings[key] = value;
    }

    static getInstance(){
        if(!AppConfig._instance){
            AppConfig._instance = new AppConfig();
        }
        return AppConfig._instance;
    }
}

const config1 = new AppConfig.getInstance();
const config2 = new AppConfig.getInstance();

config1.set('locale', 'en-US');

console.log(config2.get('locale')); // Output: 'en-US'
console.log(config1 === config2); // Output: true
