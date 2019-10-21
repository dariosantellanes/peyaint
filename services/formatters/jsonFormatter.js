const DataFormatter = require('./dataFormatter');

class JSONFormatter extends DataFormatter {
    constructor() {
        super();
    }

    format(data) {
        return JSON.stringify(data);
    }
}

module.exports = JSONFormatter;