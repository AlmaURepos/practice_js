import {currency} from './config.mjs';

export const formatPrice = (amount) =>{
    return `${currency} ${amount.toFixed(2)}`;
}