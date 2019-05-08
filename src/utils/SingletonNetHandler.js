const DashboardLoader = require('../utils/DashboardLoader');

class NetHandler{
    constructor(){
        console.info("NetHandler()");
        this.networks = []; //insieme di tutte le reti
        this.dashboards = []; //insieme delle dashboard che contengono una rete
        this.backendSrv = null; //deve passarmela il primo panel
        this.bayesian_graphs = []; //instanze di bayesian graph panel
        this.dashboardLoader = null; //istanza di DashboardLoader
    }
    
    find(bayesian){
        let index = -1;
        for(let i=0;i<this.bayesian_graphs.length;i++){
            if(bayesian.panel.id === this.bayesian_graphs[i].panel.id){
                index = i;
                break;
            }
        }
        //console.info({index});
        return index;
    }
    
    add(bayesian){
        if(this.find(bayesian)===-1){//se è nuovo
            this.bayesian_graphs.push(bayesian); //aggiungo
            //console.info("Added: ");
            //console.info(bayesian.panel.id);
            if(this.backendSrv === null){
                this.backendSrv = bayesian.backendSrv;
                this.dashboardLoader = new DashboardLoader(this.backendSrv); //lo creo nuovo solo una volta con il backend
            }
        }
    }
    
    remove(bayesian){
        console.info("Remove at position" + this.find(bayesian));
    }
    
    getAllNets(refresh){
        //console.info("getAllNets()");
        //console.info({refresh});
        if(!refresh && this.networks.length !== 0) return this.networks;
        
        this.dashboardLoader.getDashboards()
            .then((res)=>{
                this.dashboards = res;
                this.networks = this.dashboardLoader.extract(res);
                this.notifyAll();
                return this.networks;
            });
    }
    
    notify(index){
        this.bayesian_graphs[index].update();
    }
    
    notifyAll(){
        //console.info("About to notifiy:");
        for(let i=0;i<this.bayesian_graphs.length;i++){
            //console.info(this.bayesian_graphs[i].panel.id);
            this.notify(i);
        }
    }
    
    findNetIndex(net){
        for(let i=0;i<this.networks.length;i++)
            if(net.id === this.networks[i].id)
                return i;
    }
    
    modify(net){
        //console.info("NetHandler: modify()");
        let index = this.findNetIndex(net);
        this.networks[index] = net;
        this.save(index);
    }
    
    save(index) {
        /*
        return this.backendSrv
            .post('api/dashboards/import', {
                dashboard: this.dashboards[index],
                overwrite: true,
                folderId: 0,
            })
            .then(()=>{
                console.info("saved");
                this.notifyAll();
            })
            .catch((err)=>console.info(err));
        */
        let options = {
            overwrite : true
        };
        if(this.dashboards){
            console.info(this.dashboards);
            return this.backendSrv.saveDashboard(this.dashboards[index],options); //in teoria si può semplificare di brutto
        }
        
    }
}

class SingletonNetHandler { //una classe che controlla le varie istanze di NetHandler
    constructor() {
        if (!SingletonNetHandler.instance) {
            SingletonNetHandler.instance = new NetHandler(); //deve avvenire solo la prima volta e non ripetersi per fare in modo che il singleton sia garantito
        }
    }
    getInstance() {
        return SingletonNetHandler.instance;
    }
}

module.exports =  SingletonNetHandler;

