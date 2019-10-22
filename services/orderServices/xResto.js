const OrderService = require('./orderService');
const XMLFormatter = require('../formatters/xmlFormatter');
const config = require('config');

class XResto extends OrderService {
    constructor() {
        super();
        this._formatter = new XMLFormatter();
    }

    calloutOptions() {
        let xrestoOpts = config.XResto;
        let opts = {};
        if (xrestoOpts) {
            opts.method = 'POST';
            opts.url = `${xrestoOpts.url}/${xrestoOpts.endpoint}`;
            opts.headers = xrestoOpts.headers;
            opts.responseType = 'arraybuffer'
        }
        return opts;
    }

    processData(data) {
        let order = {};
        let orderDate = new Date(data.registeredDate);

        order.customer = {
            name: `${data.customer.name} Integrations`,
            coordinates: data.address.coordinates,
        }
        order.business = {
            name: data.restaurant.name
        }
        order.status = data.state;
        order.date = {
            year: orderDate.getFullYear(),
            month: `0${(orderDate.getMonth() + 1)}`.slice(-2),
            day: `0${(orderDate.getDate())}`.slice(-2),
        }
        order.notes = data.notes;
        order.total = data.subtotal;
        order.items = this.processItems(data.items);

        let calloutOpts = this.calloutOptions();
        calloutOpts.data = this._formatter.format({ order: order });
        return calloutOpts;
    }

    processItems(data) {
        let items = [];
        data.forEach((elem) => {
            items.push({
                item: {
                    name: elem.name,
                    quantity: elem.quantity,
                    price: elem.total,
                }
            })
            elem.options.forEach((opt) => {
                items.push({
                    item: {
                        name: opt.name,
                        quantity: opt.quantity,
                        price: 0
                    }
                });
            });
        });
        return items;
    }
}

module.exports = XResto;
