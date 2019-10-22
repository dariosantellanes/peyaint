const axios = require('axios');

module.exports = function (options, elementId, logger) {
    axios(options)
        .then((response) => {
            let buffer = Buffer.from(response.data, 'binary');
            let res = buffer.toString();
            logger.logResponse(`Created: pedidosYaId = ${elementId}, externalId = ${res.match(/\d+/g)[0]}`);
        })
        .catch((error) => {
            logger.logResponse(`Failed to push order: Id = ${elementId}`);
        });
}