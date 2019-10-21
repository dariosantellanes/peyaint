const OrderService = require('./orderService');
const XMLFormatter = require('../formatters/xmlFormatter');

class XResto extends OrderService {
    constructor() {
        super();
        this._formatter = new XMLFormatter();
    }

    processData(data) {
        let order = {};
        let orderDate = new Date(data.registeredDate);

        order.customer = {
            name: data.customer.name,
            coordinates: data.address.coordinates,
        }
        order.business = {
            name: data.restaurant.name
        }
        order.status = data.state;
        order.date = {
            year: orderDate.getFullYear(),
            month: orderDate.getMonth() + 1,
            day: orderDate.getDate()
        }
        order.notes = data.notes;
        order.total = data.total;
        order.items = data.items.map((elem) => {
            return {
                item: {
                    name: elem.name,
                    quantity: elem.quantity,
                    price: elem.total,
                }
            }
        });
        console.log(this._formatter.format({ order: order }));
    }
}

module.exports = XResto;
