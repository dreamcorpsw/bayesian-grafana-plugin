const Influx = require('./Influx');
const DashboardLoader = require('./DashboardLoader');
const LogicNetBuilder = require('./LogicNetBuilder');
const alertData = require('./AlertData');

//classe che gestisce i loop di inserimento valori su influxdb
class Looper{
    constructor(){
        //console.info("Looper()");
        this.backendSrv = null;
        this.networks = [];
        this.logic_networks = [];
        this.influxes = [];
        //this.loop(10000); //starts the loop
    }
    setBackendSrv(backendSrv){
        //console.info("setBackendSrv");
        if(this.backendSrv === null){
            this.backendSrv = backendSrv;
            alertData.addBackend(backendSrv);
        }
        
    }
    loop(time){
        const loader = new DashboardLoader(this.backendSrv); //scaricatore de porto
        this.networks = loader.getNets();
        this.linkDatabases(); //collego er databases
        //costruisco le reti logiche
        this.logic_networks = LogicNetBuilder.buildAllNets(this.networks);
        
        this.timer = setInterval(()=>{
            //check stop conditions
            if(this.stopLoop){
                setTimeout(()=>clearInterval(this.timer),0);
            }
            //carico le reti
            this.networks = loader.getNets()
                .then(()=>{
                    
                    //leggo i valori dai panel
                    this.datas = alertData.getDataFromAllAlerts(this.networks);
                    
                    console.info(this.datas);
                    
                    let data,stateIndex;
                    for(let i=0;i<this.datas.length;i++){
                        if(!this.networks[i].monitored) continue; //se non è monitorata, skippa il calcolo
                        //la rete è monitorato
                        data = this.datas[i];
                        if(data.value !== null){ //controllo sui dati non utili
                            stateIndex = this.decideState(data.net,data.node,data.value); //capisco in che stato si trova il nodo
                            this.logic_networks[data.net].observe(this.networks[data.net].nodi[data.node].id,this.networks[data.net].nodi[data.node].stati[stateIndex]); //observe di jsbayes
                        }
                        else if(data.net !== null && data.node !== null) { //se non ho un valore, ma ho una rete e un nodo
                            this.logic_networks[data.net].unobserve(this.networks[data.net].nodi[data.node].id); //unobserve di jsbayes
                        }
                        this.samplingNet(data.net) //sampling
                            .then(()=>{
                                //influx insert
                                let nodes = [];
                                let states = [];
                                let probs = [];
                
                                for(let j=0;j<this.networks[data.net].nodi.length;j++){
                                    nodes.push(this.networks[data.net].nodi[j].id);
                                    states.push(this.networks[data.net].nodi[j].stati);
                                    probs.push(this.logic_networks[data.net].node(this.networks[data.net].nodi[j].id).probs());
                                }
                                this.influxes[data.net].insert(nodes,states,probs)
                                    .then(()=>console.info("influx insert"))
                                    .catch((err)=>console.info(err));
                            });
                    }
                }
                );
        },time);
    }
    
    
    loopAsync(time){
        console.info("loopAsync()");
        const loader = new DashboardLoader(this.backendSrv); //scaricatore de porto
        loader.getNets()
            .then((nets)=>{
                this.networks = nets;
                this.linkDatabases(); //collego er databases
                //costruisco le reti logiche
                this.logic_networks = LogicNetBuilder.buildAllNets(this.networks);
                
                //real loop
                this.timer = setInterval(()=>{
                    //check stop conditions
                    if(this.stopLoop){
                        setTimeout(()=>clearInterval(this.timer),0);
                    }
        
                    loader.getNets()
                        .then((nets)=>{
                
                            this.networks = nets;
                
                            let stateIndex,panelId,influx_index;
                            let promises;
                            console.info("got networks");
                            console.info(this.networks);
                
                            for(let i=0;i<this.networks.length;i++) { //per tutte le reti
                    
                                if (!this.networks[i].monitored) continue; //se non è monitorata, skippa il calcolo
                    
                                promises = [];
                    
                                for(let j=0;j<this.networks[i].nodi.length;j++) { //per tutti i nodi delle reti monitorate
                        
                                    panelId = this.networks[i].nodi[j].panel;
                        
                                    if (panelId === null){
                                        this.logic_networks[i].unobserve(this.networks[i].nodi[j].id); //unobserve di jsbayes
                                        continue;
                                    } //se non ha un panel associato, skippa il calcolo
                        
                                    promises.push(alertData.getValueFromAlert(i, j, panelId) //estraggo i dati dal panel del nodo della rete monitorata
                                        .then((value)=>{ //quando ha finito di cercare i dati
                                            if (value !== null) { //controllo sui dati non utili
                                                stateIndex = this.decideState(i, j, value); //capisco in che stato si trova il nodo
                                                this.logic_networks[i].observe(this.networks[i].nodi[j].id, this.networks[i].nodi[j].stati[stateIndex]); //observe di jsbayes
                                            }
                                        })
                                    );
                                }
                    
                                //una volta finito tutte le operazioni di get sulla rete "i" faccio il sampling
                                Promise.all(promises)
                                    .then(()=>{
                                        //sampling della rete
                                        this.samplingNet(i)
                                            .then(() => {
                                    
                                                let nodes = [];
                                                let states = [];
                                                let probs = [];
                                    
                                                for (let j = 0; j < this.networks[i].nodi.length; j++) {
                                                    nodes.push(this.networks[i].nodi[j].id);
                                                    states.push(this.networks[i].nodi[j].stati);
                                                    probs.push(this.logic_networks[i].node(this.networks[i].nodi[j].id).probs());
                                                }
                                    
                                                influx_index = this.findDatabase(this.networks[i].id);
                                                this.influxes[influx_index].insert(nodes, states, probs)
                                                    .then(() => console.info("influx insert"))
                                                    .catch((err) => console.info(err));
                                            });
                                    });
                            }
                        });
                },time);
            });
    }
    
    findDatabase(net_id){
        for(let i=0;i<this.influxes.length;i++)
            if(net_id === this.influxes[i].database)
                return i;
    }
    
    linkDatabases(){
        for(let i=0;i<this.networks.length;i++){
            //bisogna aggiungere ad ogni rete i campi dati host & port
            this.influxes.push(new Influx(this.networks[i].host,this.networks[i].port,this.networks[i].id)); //inserisco un nuovo influx
            //this.influxes.push(new Influx("http://localhost",":8086",net.id)); //old way --> same database
        }
    }
    start(net,i){
        this.stopLoop = false;
        console.info("starts loop net "+(i+1)+" every "+net.time+" ms");
        this.loopAsync(net.time); //lo prendo direttamente dalla rete che gli passo
    }
    stop(net,i){
        //this.networks.splice();
        console.info("stop loop net "+(i+1));
        this.stopLoop = true;
        //this.setNet(net); //riscrivo la struttura in modo tale che non vengano comunque effettuate le query di scrittura, però sta continuando a ciclare
        //setTimeout(()=>clearInterval(this.timer),1000); //inefficace per ora, non riesco a fermare il loop
    }
    decideState(netIndex,nodeIndex,alert_value){
        //console.info("decideState");
        let stateIndex=0; //indice dello stato in cui mi trovo
        for(let i=0;i<this.networks[netIndex].nodi[nodeIndex].soglie.length-1;i++){ //scorro tutte le soglie
            if(alert_value>this.networks[netIndex].nodi[nodeIndex].soglie[i])
                stateIndex++;
            else break;
        }
        return stateIndex;
    }
    async samplingNet(netIndex){ //mi serve solo l'indice della rete
        return await this.logic_networks[netIndex].sample(1000000); //inference
    }
    /*sampling(){
        //console.info("sampling");
        let promises = [];
        for(let i=0;i<this.networks.length;i++)
            promises.push(this.samplingNet(i));
        return Promise.all(promises);
    }*/
}

module.exports = new Looper();
