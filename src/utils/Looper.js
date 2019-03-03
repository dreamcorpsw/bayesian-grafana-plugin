const Influx = require('./Influx');
const NetParser = require('./NetParser');
//classe che gestisce i loop di inserimento valori su influxdb
class Looper{
    constructor(){
        console.info("Looper()");
        this.backendSrv = null;
        this.networks = [];
        this.logic_networks = [];
        this.influxes = [];
        //this.loop(10000); //starts the loop
    }
    setBackendSrv(backendSrv){
        //console.info("setBackendSrv");
        if(this.backendSrv === null)
            this.backendSrv = backendSrv;
    }
    existNet(net){ //restituisce l'indice della rete cercata, oppure -1 se non esiste
        //console.info("existNet");
        for (let i=0;i<this.networks.length;i++)
            if(net.id === this.networks[i].id) return i; //controllo il nome della rete ==> univoco si spera
        return -1;
    }
    setNet(net){
        //console.info("setNet");
        let netIndex = this.existNet(net);
        if(netIndex===-1){ //se non esiste già
            let parser = new NetParser(net);
            let logic_net = parser.parse();
            if(logic_net !== null){
                this.logic_networks.push(logic_net);
                this.networks.push(net); //inserisco se passa il parsing
                this.influxes.push(new Influx("http://localhost",":8086",net.id)); //inserisco un nuovo influx
            }
        }
        else this.networks[netIndex] = net;
    }
    
    /**
     * iterate over getDataFromAllAlerts
     */
    loop(time){
        this.timer = setInterval(()=>{
            this.getDataFromAllAlerts();
            if(this.stopLoop){
                setTimeout(()=>clearInterval(this.timer),0);
            }
        },time);
    }
    
    start(net, time){
        this.setNet(net);
        this.stopLoop = false;
        this.loop(time);
    }
    stop(net){
        //this.networks.splice();
        console.info("Looper stop");
        this.stopLoop = true;
        //this.setNet(net); //riscrivo la struttura in modo tale che non vengano comunque effettuate le query di scrittura, però sta continuando a ciclare
        //setTimeout(()=>clearInterval(this.timer),1000); //inefficace per ora, non riesco a fermare il loop
    }
    
    async getDataFromAlert(netIndex,nodeIndex,panelId){
        return await this.backendSrv.get('/api/alerts/?panelId='+panelId)
            .then(res => {
                let alert_value = null;
                //not null, not empty, not null first, non empty first, not null evalData
                if(res !== null && res.length !== 0 && res[0] !== null && res[0].length !==0 && res[0].evalData !== null && res[0].evalData.evalMatches !== null && res[0].evalData.evalMatches.length !== 0 && res[0].evalData.evalMatches[0].value !== null) {
                    alert_value = res[0].evalData.evalMatches[0].value;
                    this.decideState(netIndex,nodeIndex,alert_value); //ora che so il valore da confrontare monitoro lo stato
                }
                else this.observe(netIndex,this.networks[netIndex].nodi[nodeIndex].id,this.networks[netIndex].nodi[nodeIndex].stati[0]); //seleziono il primo stato
            })
            .catch(err => {
                    err.isHandled=true;
                    //console.log("No value for the alert");
                    //eseguo comunque una observe ==> se non ho un alert significa che mi trovo nel primo stato
                    this.observe(netIndex,this.networks[netIndex].nodi[nodeIndex].id,this.networks[netIndex].nodi[nodeIndex].stati[0]); //seleziono il primo stato
            });
    }
    getDataFromAllAlerts(){
        //console.info("getDataFromAllAlerts");
        const promises = [];
        let panelId = null;
        for(let i=0;i<this.networks.length;i++){ //per ogni rete
            if(this.networks[i].monitored) { //solo se la rete ha richiesta di monitoraggio
                for (let j = 0; j < this.networks[i].nodi.length; j++) { //per tutti i nodi
                    panelId = this.networks[i].nodi[j].panel;
                    if (panelId) //filtro per i nodi non monitorati
                        promises.push(this.getDataFromAlert(i, j, panelId)); //eseguo il check dell'alert solo per i panel associati
                }
            }
        }
        Promise.all(promises)  //lock synchro
            .then(()=>{
                this.sampling() //sampling dopo tutti gli aggiornamenti degli stati
                    .then(()=>{ //completato il ricalcolo devo salvare tutti i valori di probabilità nell'influx
                        for(let i=0;i<this.networks.length;i++){ //per ogni rete/database lancio una insert
                            let nodes = [];
                            let states = [];
                            let probs = [];
                            for(let j=0;j<this.networks[i].nodi.length;j++){
                                nodes.push(this.networks[i].nodi[j].id);
                                states.push(this.networks[i].nodi[j].stati);
                                probs.push(this.logic_networks[i].node(this.networks[i].nodi[j].id).probs());
                            }
                            this.influxes[i].insert(nodes,states,probs)
                                .then(()=>console.info("influx insert"))
                                .catch((err)=>console.info(err));
                        }
                        
                    });
            });
    }
    //from a threshold to a state
    decideState(netIndex,nodeIndex,alert_value){
        //console.info("decideState");
        let stateIndex=0; //indice dello stato in cui mi trovo
        for(let i=0;i<this.networks[netIndex].nodi[nodeIndex].soglie.length-1;i++){ //scorro tutte le soglie
            if(alert_value>this.networks[netIndex].nodi[nodeIndex].soglie[i])
                stateIndex++;
            else break;
        }
        this.observe(netIndex,this.networks[netIndex].nodi[nodeIndex].id,this.networks[netIndex].nodi[nodeIndex].stati[stateIndex]);
    }
    //monitoro un nodo di una rete in un certo stato
    observe(netIndex,nodo,stato){
        this.logic_networks[netIndex].observe(nodo,stato); //observing
    }
    //smetto di monitorare un nodo di una rete
    unobserve(netIndex,nodo){
        this.logic_networks[netIndex].unobserve(nodo); //unobserving
    }
    //sample di una rete
    async samplingNet(netIndex){ //mi serve solo l'indice della rete
        //console.info("samplingNet");
        return await this.logic_networks[netIndex].sample(1000000); //inference
    }
    //sample di tutte le reti
    sampling(){
        //console.info("sampling");
        let promises = [];
        for(let i=0;i<this.networks.length;i++)
            promises.push(this.samplingNet(i));
        return Promise.all(promises);
    }
    //mi passa la rete del nodo configurato:
    //associazione/dissociazione: aggiungo/modifico la rete
    configure(net){
        //console.info("configure");
        this.setNet(net); //gestisce l'aggiunta o il replace della configurazione
    }
}

module.exports = new Looper();