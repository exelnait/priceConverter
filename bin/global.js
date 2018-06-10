#!/usr/bin/env node

const priceConverter = require('../lib/index.js');

const args = process.argv.splice(process.execArgv.length + 2);

const price = parseInt(args[0]);
const currency = args[1];

priceConverter.convertCurrency(price, 'USD', currency).then(
    (convertedPrice => {
        console.log(`${price} USD = ${convertedPrice} ${currency}`);
    }),
    (error) => {
        console.log(error)
    }
);