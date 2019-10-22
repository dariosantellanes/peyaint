const async = require('async');
const listFiles = require('./listFiles');
const validateSchema = require('./validateSchema');
const calloutService = require('./calloutService');

const Logger = require('./logger');

class DataService {

    constructor() {
        this._services = {};
        this._logger = new Logger();
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
                    let calloutData = this._services[integration].processData(iter);
                    calloutService(calloutData, iter.id, this._logger);
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


const run = async () => {
    let service = new DataService();
    await service.init();
    process.on('message', (data) => {
        service.processData(data);
    });
};


run();