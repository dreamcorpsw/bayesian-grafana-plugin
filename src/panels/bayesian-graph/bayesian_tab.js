//const Looper = require('../../utils/Looper');
class BayesianTabCtrl{
    /** @ngInject */
    constructor($scope, backendSrv, $location){
        console.info("BayesianTabCtrl");
        $scope.editor = this; //nome del controller nell'html
        this.panelCtrl = $scope.ctrl;
        this.panel = this.panelCtrl.panel; //variabile per modellare variabili presenti nell'html
        this.backendSrv = backendSrv; //variabile per le chiamate backend di Grafana
        this.$location = $location;
        
        this.onInitData(); //inizializzo le variabili
        
        this.searchNets()
            .then(()=>this.importNets()
                .then(()=>console.info("done importing nets"))
            )
            .catch((err)=>console.info(err));
    }
    onInitData(){
        this.networks=[];
        this.dashboards=[];
        this.uids = []; //per gli identificativi delle dashboard
        //utilizzo degli array contenenti varie informazioni sulla rete che andrò a sfruttare durante l'esecuzione del programma
        this.nodi = [];
        
        this.samples = 10000; //numero di sampling da fare, il default, utilizzato anche da jsbayes, è 10k
        
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
        
        this.associated=false;
        
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
                this.dashboards.push(res.dashboard);
                this.networks.push(res.dashboard.network);
            })
            .catch(err => {
                err.isHandled = true;
            });
    }
    importNets() {
        this.dashboards = []; //reset
        this.networks = []; //reset
        const promises = this.uids.map(uid_container => this.importSingleNet(uid_container.uid));
        return Promise.all(promises); //synchro
    }
    save(index) {
        //need for check integrity of the net
        //
        return this.backendSrv
            .post('api/dashboards/import', {
                dashboard: this.dashboards[index],
                overwrite: true,
                folderId: 0,
            })
            .then(()=>console.info("saved"))
            .catch((err)=>console.info(err));
    }
    /*
    * methods for settings values
    * */
    setNet(net){
        //console.info("setNet()");
        if(net !== null) { //controllo che esista una rete
            this.netPos = this.networks.indexOf(net); //ricerco la posizione della rete
            let found = false;
            for(let i=0;i<this.networks[this.netPos].nodi.length;i++){
                if(this.networks[this.netPos].nodi[i].panel === this.panel.id){
                    this.associated = true;
                    found = true;
                }
            }
            if(!found) this.associated=false;
            
            this.nodePos = null;
            this.statePos = null;
            this.thresholdPos = null;
            console.info("done");
        }
        else{
            this.netPos = null;
            console.error("Impossible to set net");
        }
    }
    setNode(node){
        console.info("setNode()");
        if(this.netPos !== null && node !== null) {
            this.nodePos = this.networks[this.netPos].nodi.indexOf(node);
            //console.info("done");
        }
        else{
            this.nodePos = null;
            console.error("Impossible to set node");
        }
    }
    setState(state){
        console.info("setState()");
        if(this.nodePos !== null && state !== null){
            this.statePos = this.networks[this.netPos].nodi[this.nodePos].stati.indexOf(state);
            //console.info("done");
            this.thresholdPos = this.statePos;
            this.threshold = this.networks[this.netPos].nodi[this.nodePos].soglie[this.thresholdPos];
            this.setThreshold(this.threshold, this.thresholdPos); //fake chiamata
        }
        else{
            this.statePos = null;
            this.thresholdPos = null;
            console.error("Impossible to set state");
        }
    }
    setThreshold(threshold, index){
        //qui modifico le soglie anche nel JSON originale
        console.info("setThreshold() of index "+index);
        if(this.nodePos !== null && threshold !== null){
            this.networks[this.netPos].nodi[this.nodePos].soglie[index] = threshold; //effective changes
            console.info("threshold set to: "+threshold);
            //console.info("done");
        }
        else {
            console.error("Impossible to set threshold");
        }
    }
    setSamples(number){
        //console.info("setSamples()");
        if(number !== null){
            this.samples = number;
            console.info("done");
        }
        else {
            this.samples = 10000; //default
            console.info("Impossible to set samples");
        }
    }
    
    /*
    * Net Structure changes
    * */
    associate(NodeId){
        //appCtrl.emit('associate', NodeId, this.nodePos, this.panel.id, this.backendSrv);
        this.associated = true;
        //modifico il valore del panel associato con l'id di questo panel
        this.networks[this.netPos].nodi[this.nodePos].panel = this.panel.id;
        //lancio la save
        this.save(this.netPos)
            .then(()=>{
                //Looper.setBackendSrv(this.backendSrv); //invio la variabile per fare le richieste in backend
                //Looper.configure(this.networks[this.netPos]);
            });
    }
    dissociate(NodeId){
        //find nodePos
        for(let i=0;i<this.networks.length;i++){
            for(let j=0;j<this.networks[i].nodi.length;j++){
                if(this.panel.id === this.networks[i].nodi[j].panel){
                    this.netPos=i;
                    this.nodePos=j;
                }
            }
        }
        //appCtrl.emit('dissociate', NodeId, this.nodePos);
        this.associated = false;
        //modifico il valore del panel associato a null
        this.networks[this.netPos].nodi[this.nodePos].panel = null;
        //lancio la save
        this.save(this.netPos)
            .then(()=>{
                //Looper.setBackendSrv(this.backendSrv); //invio la variabile per fare le richieste in backend
                //Looper.configure(this.networks[this.netPos]); //configurazione
                //per utilizzare la unobserve mi serve la rete e il nodo
                //Looper.unobserve(this.netPos,this.networks[this.netPos].nodi[this.nodePos]); //forzo la unobserve
            });
    }
}

//funzione di export per sfruttare l'import di questa classe
export function BayesianTab() {
    return {
        templateUrl: 'public/plugins/bayesian-graph/partials/bayesian_network.html', //struttura html a cui si appoggia
        controller: BayesianTabCtrl //associo la classe appena creata come controller che mi serve per lavorare con angular
    };
}