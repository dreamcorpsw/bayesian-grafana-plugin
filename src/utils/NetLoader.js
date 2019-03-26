class NetLoader{ //deve essere gestito il ritorno delle dashboard in maniera intelligente
    constructor(backend){
        console.info("NetLoader");
        this.backend = backend;
        this.networks = [];
        this.dashboards = [];
        this.uids = [];
    }
    
    searchNets(){
        return this.backend.get('/api/search?tag=bayesian-network')
            .then(res =>{
                this.uids = res;
                //console.info(this.uids);
            })
            .catch(err=>console.log(err));
    }
    async importSingleNet(uid) {
        return await this.backend
            .getDashboardByUid(uid)
            .then(res => {
                this.dashboards.push(res.dashboard);
                this.networks.push(res.dashboard.network);
            })
            .catch(err => {
                err.isHandled = true;
            });
    }
    importNets() {
        this.networks = []; //reset
        this.dashboards = []; //reset
        const promises = this.uids.map(uid_container => this.importSingleNet(uid_container.uid));
        return Promise.all(promises) //synchro
            .then(() =>{
                return this.networks;
            });
    }
    getNets(){ //ritorna le nets
        return this.searchNets()
            .then(()=>this.importNets())
            .catch((err)=>console.info(err));
    }
    
}

module.exports = NetLoader;