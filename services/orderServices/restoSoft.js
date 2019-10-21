const OrderService = require('./orderService');
const JSONFormatter = require('../formatters/jsonFormatter');

class RestoSoft extends OrderService {
    constructor() {
        super();
        this._formatter = new JSONFormatter();
    }

    processData(data) {
        let order = {};
        let orderDate = new Date(data.registeredDate);
        
        order.date = orderDate.toISOString().split('T')[0];
        order.notes = data.notes;
        order.total = data.total;
        order.items = data.items.map((elem) => {
            return {
                name: elem.name,
                quantity: elem.quantity,
                price: elem.total,
            }
        });
        order.customer = {
            name: data.customer.name,
            location: {
                latitude: data.address.coordinates.split(',')[0],
                longitude: data.address.coordinates.split(',')[1],
            }
        }
        order.business = {
            name: data.restaurant.name
        }

        console.log(this._formatter.format(order));
    }
}

module.exports = RestoSoft;
