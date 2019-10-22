const OrderService = require('./orderService');
const JSONFormatter = require('../formatters/jsonFormatter');
const config = require('config');

class RestoSoft extends OrderService {
    constructor() {
        super();
        this._formatter = new JSONFormatter();
    }

    calloutOptions() {
        let restoSoftOpts = config.RestoSoftService;
        let opts = {};
        if (restoSoftOpts) {
            opts.method = 'POST';
            opts.url = `${restoSoftOpts.url}/${restoSoftOpts.endpoint}`;
            opts.headers = restoSoftOpts.headers;
            opts.responseType = 'arraybuffer';
        }
        return opts;
    }

    processData(data) {
        let order = {};
        let orderDate = new Date(data.registeredDate);

        order.date = orderDate.toISOString().split('T')[0];
        order.notes = data.notes;
        order.total = data.subtotal;
        order.items = this.processItems(data.items);
        order.customer = {
            name: `${data.customer.name} Developer`,
            location: {
                latitude: data.address.coordinates.split(',')[0],
                longitude: data.address.coordinates.split(',')[1],
            }
        }
        order.business = {
            name: data.restaurant.name
        }

        let calloutOpts = this.calloutOptions();
        calloutOpts.data = this._formatter.format(order);
        return calloutOpts;
    }

    processItems(data) {
        let items = [];
        data.forEach((elem) => {
            items.push({
                name: elem.name,
                quantity: elem.quantity,
                price: elem.total,
            })
            elem.options.forEach((opt) => {
                items.push({
                    name: opt.name,
                    quantity: opt.quantity,
                    price: 0
                });
            });
        });
        return items;
    }
}

module.exports = RestoSoft;
