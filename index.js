process.env['NODE_ENV'] = 'middleware';

const config = require('config');
const PyService = require('./services/pyService');

(() => {
    try {
        let service = new PyService();
        service.start();
    } catch (err) {
        console.log(`Error initializing service: ${err}`);
        process.exit(1);
    }
})();