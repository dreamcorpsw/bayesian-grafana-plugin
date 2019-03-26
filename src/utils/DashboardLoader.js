class DashboardLoader {
    constructor(backend){
        console.info("DashboardLoader");
        this.backend = backend;
        this.dashboards = [];
        this.uids = [];
    }
    searchDashboards(){
        return this.backend.get('/api/search?tag=bayesian-network')
            .then(res =>{
                this.uids = res;
            })
            .catch(err=>console.log(err));
    }
    async importSingleDashboard(uid) {
        return await this.backend
            .getDashboardByUid(uid)
            .then(res => {
                this.dashboards.push(res.dashboard);
            })
            .catch(err => {
                err.isHandled = true;
            });
    }
    importDashboards() {
        this.dashboards = []; //reset
        const promises = this.uids.map(uid_container => this.importSingleDashboard(uid_container.uid));
        return Promise.all(promises); //synchro
        
    }
    getDashboards(){ //ritorna le dashboards
        return this.searchDashboards()
            .then(()=>this.importDashboards()
                .then(() =>{
                    return this.dashboards;
                })
            )
            .catch((err)=>console.info(err));
    }
    extract(dashboards){ //ritorno sempre le dashboard e poi estraggo le nets
        let networks = [];
        for(let i=0;i<dashboards.length;i++)
            networks.push(dashboards.network);
        return networks;
    }
    getNets(){
        return this.getDashboards()
            .then(()=> {
                return this.extract(this.dashboards);
            });
    }
}
module.exports = DashboardLoader;