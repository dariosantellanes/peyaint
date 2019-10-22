const axios = require('axios');
const config = require('config');
const { fork } = require('child_process');

class PyService {

    constructor() {
        this._srvConfig = config.PedidosYaService;
        this._dataService = undefined;

    }

    async start() {
        this._dataService = fork('./services/dataService');
        this.fetchData();
    }

    processResponse(data) {
        if(this._dataService){
            this._dataService.send(data);
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
        setTimeout(this.fetchData.bind(this), 2000);
    }
}

module.exports = PyService


