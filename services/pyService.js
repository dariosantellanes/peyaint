const axios = require('axios');
const config = require('config');
const DataService = require('./dataService');

class PyService {

    constructor() {
        this._srvConfig = config.PedidosYaService;
        this._dataService = new DataService();
    }

    async start() {
        await this._dataService.init();
        this.fetchData();
    }

    isValidSchema(data){
        return true;
    }

    processResponse(data) {
        if(this.isValidSchema(data)){
            this._dataService.processData(data);
        }
    }

    fetchData() {
        axios.get(`${this._srvConfig.url}/${this._srvConfig.endpoint}`)
            .then(response => {
                let res = response.data;
                if (res.count) {
                    this.processResponse(res.data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
}

module.exports = PyService