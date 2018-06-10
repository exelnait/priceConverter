const https = require('https');

const currencies = ['UAH', 'EUR', 'GBP'];

function convertCurrency(amount, fromCurrency, toCurrency) {
    return new Promise((resolve, reject) => {
        if (!amount || !Number.isInteger(amount)) {
            reject(new Error('Wrong price: ' + amount + '. It should be a number'))
        }

        fromCurrency = encodeURIComponent(fromCurrency);
        toCurrency = encodeURIComponent(toCurrency);
        if (!currencies.includes(toCurrency)) {
            reject(new Error('Wrong currency value: ' + toCurrency + '. You can convert to UAH, EUR or GBP'))
        }
        const query = fromCurrency + '_' + toCurrency;

        const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;

        https.get(url, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const result = JSON.parse(body)[query];
                    if (result) {
                        resolve(Math.round(result * amount * 100) / 100)
                    } else {
                        reject(new Error("Value is not found for " + query));
                    }
                } catch(e) {
                    reject(new Error("Currency parse error (" + e + ")"));
                }
            });
        }).on('error', function(e){
            reject(new Error ("Got an response error (" + e + ")"));
        });
    })
}

exports.convertCurrency = convertCurrency;