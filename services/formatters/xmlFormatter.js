const DataFormatter = require('./dataFormatter');
const jsonxml = require('jsontoxml');

class XMLFormatter extends DataFormatter {
    constructor() {
        super();
    }

    format(data) {
        return jsonxml(data);
    }
}

module.exports = XMLFormatter;