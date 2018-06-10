const https = require('https');
const { expect, assert } = require('chai');

const convertCurrency = require("./../lib/index").convertCurrency;

function getCurrency(amount, toCurrency) {
    return new Promise((resolve) => {
        const query = 'USD_' + toCurrency;

        const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;

        https.get(url, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                const result = JSON.parse(body)[query];
                if (result) {
                    resolve(Math.round(result * amount * 100) / 100)
                }
            });
        })
    })
}

describe('Price converter test', function(){
    it('should give a right converted price', function(done){
        const price = 10;
        const currency = 'UAH';
        convertCurrency(price, 'USD', currency).then(convertedPrice => {
            getCurrency(price, currency).then(rightPrice => {
                expect(convertedPrice).to.equal(rightPrice)
                done()
            })
        });
    });

    it('should give an error with empty amount', function(done){
        const emptyPrice = '';
        convertCurrency(emptyPrice, 'USD', 'UAH').then(null, error => {
            expect(error.message).to.equal(`Wrong price: ${emptyPrice}. It should be a number`);
            done();
        });
    });

    it('should give an error with non-number amount', function(done){
        const nonNumberPrice = '10';
        convertCurrency(nonNumberPrice, 'USD', 'UAH').then(null, error => {
            assert.isDefined(error);
            expect(error.message).to.equal(`Wrong price: ${nonNumberPrice}. It should be a number`);
            done();
        });
    });

    it('should give an error for a wrong currency', function(done){
        const wrongCurrency = 'ABC';
        convertCurrency(10, 'USD', wrongCurrency).then(null, error => {
            assert.isDefined(error);
            expect(error.message).to.equal(`Wrong currency value: ${wrongCurrency}. You can convert to UAH, EUR or GBP`);
            done();
        });
    });
});