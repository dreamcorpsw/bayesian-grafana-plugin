import {MetricsPanelCtrl} from "grafana/app/plugins/sdk";
const Influx = require('../../utils/Influx');
export class netStatus extends MetricsPanelCtrl{
    /** @ngInject */
    constructor($scope,$injector,backendSrv){
        super($scope,$injector);
        $scope.editor = this;
        this.panel = $scope.ctrl.panel;
        $scope.ctrl.panel.title = "Bayesian Network Status";
        this.backendSrv = backendSrv;
        
        console.info("netStatus");
        
        this.onInitData();
    
        //chiamate asincrone innestate per l'import della struttura della rete
        this.searchNets()
            .then(()=>this.importNets()
                .catch((err)=>console.info(err))
            );
        
    }
    
    searchNets(){
        //console.info("searchNets()");
        return this.backendSrv.get('/api/search?tag=bayesian-network')
            .then(res =>{
                this.uids = res;
                console.info(this.uids);
            })
            .catch(err=>console.log(err));
    }
    
    async importSingleNet(uid) {
        return await this.backendSrv
            .getDashboardByUid(uid)
            .then(res => {
                this.networks.push(res.dashboard.network);
            })
            .catch(err => {
                err.isHandled = true;
            });
    }
    
    importNets() {
        this.networks = []; //reset
        const promises = this.uids.map(uid => this.importSingleNet(uid.uid));
        return Promise.all(promises);
    }
    
    onInitData(){
        this.networks=[]; //html
        this.uids = []; //per gli identificativi delle dashboard
        //utilizzo degli array contenenti varie informazioni sulla rete che andrò a sfruttare durante l'esecuzione del programma
        this.nodi = []; //array di variabili di nodi logici di jsbayes (qui dentro inserisco quello che ritorna la funzione g.addNode(nome, stati))
        
        //variabili per i valori di presentazione a schermo dell'informazione
        this.nets = []; //nomi delle reti
        this.id_nodes = []; //id dei nodi
        this.nodes = []; //insieme dei nomi dei nodi di una rete
        this.states_nodes = []; //stati dei nodi
        this.threshold_nodes = []; //soglie dei nodi
        this.prob_nodes = []; //probabilità
        this.samples = 10000; //numero di sampling da fare, il default, utilizzato anche da jsbayes, è 10k
        
        //variabili che memorizzano la posizione all'interno degli array precedenti che è stata scelta dall'utente a schermo
        this.netPos = null; //indice della rete scelta
        
        //variabili grafiche che memorizzano il valore scelto dall'utente a schermo
        //this.panel.samples = 10000; //numero di sample scelto
        
        //ricorda se è già stato associato un nodo oppure no
        //this.associated = false;  //true: associato / false: non associato
        this.probability_ready = false;
    }
    
    refresh(){
        /*
        this.probs = []; //pulisco l'array di probabilità
        for(let i=0;i<this.networks.length;i++)
            const influx = new Influx("http://localhost",":8086",this.networks[i].id);
        //richieste di lettura
        */
    }
}

netStatus.templateUrl = 'public/plugins/dreamcorp-app/panels/net-status-panel/module.html';

export {netStatus as PanelCtrl};
