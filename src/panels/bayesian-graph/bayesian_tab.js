import {appEvents} from 'grafana/app/core/core';
class BayesianTabCtrl{
    /** @ngInject */
    constructor($scope, backendSrv){
        console.info("BayesianTabCtrl");
        $scope.editor = this; //nome del controller nell'html
        this.panel = $scope.ctrl.panel; //variabile per modellare variabili presenti nell'html
        this.backendSrv = backendSrv; //variabile per le chiamate backend di Grafana
        this.parent = $scope.$parent.ctrl; //il padre della tab è il panel --> utile per prendersi i valori
        this.onInitData(); //inizializzo le variabili
    }
    onInitData(){
        //variabili che memorizzano la posizione all'interno degli array precedenti che è stata scelta dall'utente a schermo
        this.netPos = null; //indice della rete scelta
        this.nodePos = null; //indice del nodo scelto
        this.statePos = null; //indice dello stato scelto
        this.thresholdPos = null; //indice della soglia scelta
        this.modified = false; //variabile per tenere traccia se sono state fatte delle modifiche alle soglie
        
        //variabili grafiche che memorizzano il valore scelto dall'utente a schermo
        this.panel.rete_id = null; //nome della rete scelta
        this.panel.node_id = null; //nome del nodo scelto
        this.panel.states_node_id = null; //nome dello stato scelto
        this.panel.threshold_node_id = null; //valore della soglia scelta
        
        this.associated=false;
        this.associated_node = -1; //indice del nodo già associato se esiste
        
        this.networks = this.parent.nets; //si prende le reti dal panel
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
                    this.associated_node = i;
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
    /*
    * Net Structure changes
    * */
    modify(net) {
        console.info("BayesianTab: modify()");
        let allRight = true;
        let stato1,stato2,soglia1,soglia2;
        //check
        for (let i=0;i<net.nodi.length && allRight;i++){
            for (let j=0;j<net.nodi[i].soglie.length-1 && allRight;j++) {
                if (net.nodi[i].soglie[j] >= net.nodi[i].soglie[j + 1]) {
                    allRight = false;
                    stato1 = net.nodi[i].stati[j];
                    stato2 = net.nodi[i].stati[j+1];
                    soglia1 = net.nodi[i].soglie[j];
                    soglia2 = net.nodi[i].soglie[j+1];
                }
            }
        }
        
        if(allRight){
            this.modified = false; //nascondo il pulsante "save"
            this.parent.modify(net);
            appEvents.emit('alert-success', ['Salvataggio riuscito', '']);
        }
        else {
            appEvents.emit('alert-warning', ['Salvataggio non riuscito', 'Soglia del nodo: '+stato1+"("+soglia1+") > Soglia nodo: "+stato2+"("+soglia2+")"]);
            throw "Salvataggio non riuscito";
        }
    }
    setThreshold(threshold, index){
        //qui modifico le soglie anche nel JSON originale
        this.modified = true; //visualizzo il pulsante "save"
        if(this.nodePos !== null && threshold !== null){
            this.networks[this.netPos].nodi[this.nodePos].soglie[index] = threshold; //effective changes
        }
        else {
            appEvents.emit('alert-warning', ['Impossibile aggiornare la soglia',"" ]);
        }
    }
    
    associate(){
        this.networks[this.netPos].nodi[this.nodePos].panel = this.panel.id;
        try{
            this.modify(this.networks[this.netPos]);
            this.associated = true;
            this.associated_node = this.nodePos;
            appEvents.emit('alert-success', ['Associazione riuscita',"Il nodo "+this.networks[this.netPos].nodi[this.nodePos].id+" è stato associato a questo flusso dati" ]);
        }
        catch (e) {
            appEvents.emit('alert-error', ['Associazione non riuscita',"" ]);
        }
        
    }
    dissociate(){
        
        this.networks[this.netPos].nodi[this.associated_node].panel = null;
        try{
            this.modify(this.networks[this.netPos]);
            this.associated = false;
            appEvents.emit('alert-success', ['Dissociazione riuscita',"Il nodo "+this.networks[this.netPos].nodi[this.associated_node].id+" è stato dissociato da questo flusso dati" ]);
        }
        catch (e) {
            appEvents.emit('alert-error', ['Dissociazione non riuscita',"" ]);
        }
        
    }
}

export function BayesianTab() {
    return {
        templateUrl: 'public/plugins/bayesian-graph/partials/bayesian_network.html',
        controller: BayesianTabCtrl
    };
}