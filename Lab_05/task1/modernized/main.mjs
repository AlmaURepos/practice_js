import * as Core from './core.mjs';
import {formatPrice} from './utils.mjs';


const Cart = new Core.Cart();
const product = new Core.Product(1, "Widget", 10.99);
Cart.addItem(product, 2);
console.log("Total: " + formatPrice(Cart.getTotal()));