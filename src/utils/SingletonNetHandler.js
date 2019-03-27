const DashboardLoader = require('../utils/DashboardLoader');

class NetHandler{
    constructor(){
        console.info("NetHandler()");
        this.networks = []; //insieme di tutte le reti
        this.dashboards = []; //insieme delle dashboard che contengono una rete
        this.backend = null; //deve passarmela il primo panel
        this.bayesian_graphs = []; //instanze di bayesian graph panel
    }
    
    find(bayesian){
        let index = -1;
        for(let i=0;i<this.bayesian_graphs.length;i++){
            if(bayesian.id === this.bayesian_graphs[i].id){
                index = i;
                break;
            }
        }
        return index;
    }
    
    add(bayesian){
        if(this.find(bayesian)===-1){//se è nuovo
            this.bayesian_graphs.push(bayesian); //aggiungo
            if(this.backend === null)
                this.backend = bayesian.backend;
        }
        
    }
    
    remove(bayesian){
        console.info("Remove at position" + this.find(bayesian));
    }
    
    getAllNets(){ //version dashboards
        console.info("getAllNets()");
        if(this.networks.length === 0){ //devo eseguire i calcoli, O(N)
            console.info("first time");
            let dashboardLoader = new DashboardLoader(this.backend);
            dashboardLoader.getDashboards()
                .then((res)=>{
                    this.dashboards = res;
                    this.networks = dashboardLoader.extract(res);
                    this.notifyAll();
                    return this.networks;
                });
        }
        else return this.networks; // non eseguo nessun conto in più, ritorno la lista pronta O(1)
    }
    
    notify(index){
        this.bayesian_graphs[index].update();
    }
    
    notifyAll(){
        for(let i=0;i<this.bayesian_graphs.length;i++){
            this.notify(i);
        }
    }
    
    findNetIndex(net){
        for(let i=0;i<this.networks.length;i++)
            if(net.id === this.networks[i].id)
                return i;
    }
    
    modify(net){
        let index = -1 ; //se va male me ne accorgo perchè resta a -1
        index = this.findNetIndex(net);
        this.networks[index] = net;
        this.save(index);
    }
    
    save(index) {
        return this.backend
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
    }
}

class SingletonNetHandler { //una classe che controlla le varie istanze di NetHandler
    
    constructor() {
        console.info("SingletonNetHandler()");
        if (!SingletonNetHandler.instance) {
            SingletonNetHandler.instance = new NetHandler(); //deve avvenire solo la prima volta e non ripetersi per fare in modo che il singleton sia garantito
        }
    }
    getInstance() {
        return SingletonNetHandler.instance;
    }
    
}

module.exports =  SingletonNetHandler;

