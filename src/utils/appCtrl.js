const EventEmitter = require('eventemitter3');
import {path, getJsonAsText} from './utils';
//classe di gestione dell'applicazione per eventi e dati condivisi
class AppCtrl extends EventEmitter{
    constructor(){
        super();
        console.info("new AppCtrl");
        const my_url = path()+'/networks/rete.json';
        getJsonAsText(this,my_url);
    }
    createBN(text) {
        console.info("createBN() - App");
        var rete = JSON.parse(text);
        
        const jsbayes = require('jsbayes');
        this.g = jsbayes.newGraph();
        
        //function to set the variables
        this.onInitData();
        
        this.nets.push(rete.rete); //per ora un solo valore
        
        let i;
        //catturo le informazioni e creo i nodi
        for (i = 0; i<rete.nodi.length; i++){ //per tutti i nodi li creo e li metto i una lista
            this.id_nodes.push(rete.nodi[i].id); //mi salvo l'id del nodo
            this.states_nodes.push(rete.nodi[i].stati); //mi salvo gli stati
            this.threshold_nodes.push(rete.nodi[i].soglie); //mi salvo le soglie
            this.nodi.push(this.g.addNode(this.id_nodes[i],this.states_nodes[i])); //nuovo nodo logico della rete bayesiana
            //this.nodi[i].setCpt(rete.nodi[i].cpt); //inserisco le cpt dentro ai nodi e non più random
        }
        
        this.nodes.push(this.id_nodes); //inserisco un array dentro un altro per essere pronto a gestire più reti
        
        var index, parent_name;
        
        //creo le relazioni padre-figlio
        for (i = 0; i<rete.nodi.length; i++){ //per tutti i nodi aggiungo i genitori
            if(rete.nodi[i].parents !== null) { // se ha almeno un padre
                for (let j = 0; j < rete.nodi[i].parents.length; j++) {
                    
                    parent_name = rete.nodi[i].parents[j]; //mi salvo il nome del parent
                    
                    for(let k =0;k<rete.nodi.length;k++){ //per tutti i nodi cerco il parent con quel nome specifico
                        if(parent_name === this.nodi[k].name) index = k;
                    }
                    //devo passare la variabile stessa non la stringa
                    this.nodi[i].addParent(this.nodi[index]);
                }
            }
        }
        
        //random cpt
        this.g.reinit()
            .then(function() {
                //return this.g.sample(10000); //likelihood weight sampling aka the inference
                
            });
        
    }
    onInitData(){
        console.info("onInitData() - App");
        //utilizzo degli array contenenti varie informazioni sulla rete che andrò a sfruttare durante l'esecuzione del programma
        this.nodi = []; //array di variabili di nodi logici di jsbayes (qui dentro inserisco quello che ritorna la funzione g.addNode(nome, stati))
        
        //variabili per i valori di presentazione a schermo dell'informazione
        this.nets = []; //nomi delle reti
        this.id_nodes = []; //id dei nodi
        this.nodes = []; //insieme dei nomi dei nodi di una rete
        this.states_nodes = []; //stati dei nodi
        this.threshold_nodes = []; //soglie dei nodi
        this.samples = 10000; //numero di sampling da fare, il default, utilizzato anche da jsbayes, è 10k
        
        /*
        //variabili che memorizzano la posizione all'interno degli array precedenti che è stata scelta dall'utente a schermo
        this.netPos = null; //indice della rete scelta
        this.nodePos = null; //indice del nodo scelto
        this.statePos = null; //indice dello stato scelto
        this.thresholdPos = null; //indice della soglia scelta
        
        
        //variabili grafiche che memorizzano il valore scelto dall'utente a schermo
        this.panel.rete_id = null; //nome della rete scelta
        this.panel.node_id = null; //nome del nodo scelto
        this.panel.states_node_id = null; //nome dello stato scelto
        this.panel.threshold_node_id = null; //valore della soglia scelta
        this.panel.samples = 10000; //numero di sample scelto
        */
        //ricorda se è già stato associato un nodo oppure no
        //this.associated = false;  //true: associato / false: non associato
    }
    getAlertData(panel,backendSrv){
        this.backendSrv = backendSrv;
        //info for the http request
        const payload = {
            dashboard: "bayesian graph panel",
            panelId: 0,
        };
        //http request with API aiming at a specific panel
        const panelUrl = '/api/alerts/?panelId='+panel;
        
        return this.backendSrv.get(panelUrl, payload).then(res => {
            let alert_value = null;
            console.info(res);
            if(res === null) {
                console.error("no result, bad request");
            }
            else {
                if(res[0].evalData !== null){
                    if(res[0].evalData.evalMatches !== null){
                        alert_value = res[0].evalData.evalMatches[0].value;
                        console.info("Valore Alert from appCtrl:" + alert_value);
                        //this.ThresholdToState(alert_value); //mi cambia lo stato a quello che conta dettato dal valore dell'alert
                    }
                    else {
                        console.error("evalMatches null");
                    }
                }
                else {
                    console.error("evalData null");
                }
            }
        });
    }
}
//istanza
const appCtrl = new AppCtrl();
//listen "on", serve per creare funzioni di cui poi potrò fare "emit"
appCtrl.on('associate', (nodeId,panel, backendSrv) => {
    console.log("Associated with "+ nodeId +" at panel "+panel);
    appCtrl.getAlertData(panel,backendSrv);
});
//export this instance
module.exports = appCtrl;