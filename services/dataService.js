const async = require('async');
const listFiles = require('./listFiles');
const validateSchema = require('./validateSchema');

class DataService {

    constructor() {
        this._services = {};
    }

    async init() {
        await this.loadOrderServices();
    }

    async loadOrderServices() {
        try {
            let files = await listFiles('./orderServices');
            files.forEach(element => {
                if (!element.match(/orderService/)) {
                    let service = new (require(`./orderServices/${element}`))();
                    this._services[service.constructor.name.toLowerCase()] = service;
                }
            });
        } catch (err) {
            console.log(`An error ocurred loading Order Services: ${err}`);
        }
    }

    processData(data) {
        async.each(data, (iter, cb) => {
            if (iter.integration && this._services[iter.integration.toLowerCase()]) {
                if (!validateSchema(iter).error) {
                    let integration = iter.integration.toLowerCase();
                    this._services[integration].processData(iter);
                } else {
                    console.log('Invalid response');
                }
            }
            cb();
        }, (err) => {
            if (err) {
                console.log('A request failed to process');
            }
        });
    }
}

module.exports = DataService;


const run = () => {
    let service = new DataService();
    process.on('message', (data) => {

    });
};


run();