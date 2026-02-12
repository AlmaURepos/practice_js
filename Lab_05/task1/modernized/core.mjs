import {taxRate} from './config.mjs';

export class Product{
    #id 
    #name
    #price

    constructor(id, name, price){
        this.#id = id;
        this.#name = name;
        this.#price = price;
    }

    get price(){
        return this.#price;
    }   

    get name(){
        return this.name;
    }
}


export class Cart{
    #items = [];

    addItem(product, quantity){
        this.#items.push({ product, quantity });
    }

    getSubtotal(){
        return this.#items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }


    getTax(){
        return this.getSubtotal() * taxRate;
    }

    getTotal(){
        return this.getSubtotal() + this.getTax();
    }
}