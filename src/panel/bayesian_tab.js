
import {path, getJsonAsText} from '../utils/utils';
import appCtrl from '../utils/appCtrl';

class BayesianTabCtrl{

    /** @ngInject */
    constructor($scope, backendSrv){

        //catturo un po' di variabili dallo scope
        $scope.editor = this; //mi serve per collegare html e codice della classe
        this.panelCtrl = $scope.ctrl;
        this.panel = this.panelCtrl.panel; //collega codice della classe e html
        this.backendSrv = backendSrv;
        //struttura della rete in formato json
        const my_url = path()+'/networks/rete.json';
        //lancio la funzione asincrona che legge la rete come testo semplice
        getJsonAsText(this,my_url);
    }

    //crea la struttura logica della rete prendendo in input un file di testo
    createBN(text) {
        //console.info("createBN()");
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
        //console.info("onInitData()");
        //utilizzo degli array contenenti varie informazioni sulla rete che andrò a sfruttare durante l'esecuzione del programma
        this.nodi = []; //array di variabili di nodi logici di jsbayes (qui dentro inserisco quello che ritorna la funzione g.addNode(nome, stati))

        //variabili per i valori di presentazione a schermo dell'informazione
        this.nets = []; //nomi delle reti
        this.id_nodes = []; //id dei nodi
        this.nodes = []; //insieme dei nomi dei nodi di una rete
        this.states_nodes = []; //stati dei nodi
        this.threshold_nodes = []; //soglie dei nodi
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

        //ricorda se è già stato associato un nodo oppure no
        this.associated = false;  //true: associato / false: non associato
    }

    /*
    * methods for settings values
    * */

    setNet(net){
        //console.info("setNet()");
        if(net !== null) { //controllo che esista una rete
            this.netPos = this.nets.indexOf(net); //ricerco la posizione della rete
            //console.info(this.netPos);
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
        //console.info("setNode()");
        if(this.netPos !== null && node !== null) {
            this.nodePos = this.nodes[this.netPos].indexOf(node);
            console.info("done");
            //quando cambio il nodo deve farmi riscegliere da capo gli stati
        }
        else{
            this.nodePos = null;
            console.error("Impossible to set node");
        }
    }
    setState(state){
        console.info("setState()");
        if(this.nodePos !== null && state !== null){
            this.statePos = this.states_nodes[this.nodePos].indexOf(state);
            console.info("done");
            this.thresholdPos = this.statePos;
            this.threshold = this.threshold_nodes[this.nodePos][this.thresholdPos];
            this.setThreshold(this.threshold); //fake chiamata
        }
        else{
            this.statePos = null;
            this.thresholdPos = null;
            console.error("Impossible to set state");
        }
    }
    setThreshold(threshold){
        //qui modifico le soglie anche nel JSON originale
        console.info("setThreshold()");
        if(this.nodePos !== null && threshold !== null){
            this.threshold = threshold;
            console.info("threshold set to: "+threshold);
            console.info("done");
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
    
    startLoop(){
        //test loop
        var i = 0;
        const context = this;
        const myVar = setInterval(function(){
            console.info(i);
            appCtrl.emit('associate', context.nodeId, context.panel.id, context.backendSrv);
            i++;
            if(i===5)
                setTimeout(function (){
                    clearInterval(myVar)
                },0); //istantaneo CREDO
        }, 1000);
        
        
    }

    associate(NodeId){
        this.nodeId = NodeId;
        appCtrl.emit('associate', NodeId, this.panel.id, this.backendSrv);
        //launch an event to AppCtrl
        this.startLoop();
        //setto a true la variabile che ricorda se è già stato associato il nodo
        this.associated = true;
        //decido lo stato del nodo guardando il valore preso dall'alert
        //this.getAlertingStuff();
    }
    dissociate(NodeId){
        console.info("Dissociated with "+NodeId);
        //alert("Dissociated with " +NodeId);
        //fa la stessa cosa di "associate"
        this.associated = false;
        //invece di osservare un nodo, lo "inosservo", cioè reinserisco l'incertezza
        this.g.unobserve(this.nodi[this.nodePos].name);
        this.g.sample(this.samples);

        this.showProb();
    }

    showProb(){
        //output probabilità
        for (let x = 0;x<this.nodi.length;x++){
            console.info(this.nodi[x].probs());
        }

    }

    getAlertingStuff(){
        //questa funzione è da sistemare di brutto, funziona a colpi di fortuna per ora
        console.info("getAlertingStuff()");
        const payload = {
            dashboard: "bayesian graph panel",
            panelId: 0,
        };
        return this.backendSrv.get('/api/alerts/', payload).then(res => {
            let alert_value = null;
            console.info(res);
            if(res === null) console.error("no result, bad request");
            else{
                if(res[0].evalData !== null){
                    if(res[0].evalData.evalMatches !== null){
                        alert_value = res[0].evalData.evalMatches[0].value;
                        console.info("Valore Alert:" + alert_value);
                        this.ThresholdToState(alert_value); //mi cambia lo stato a quello che conta dettato dal valore dell'alert
                    }
                    else console.error("evalMatches null");
                }
                else console.error("evalData null");

            }
        });
    }

    ThresholdToState(value){
        console.info("ThresholdToState");
        let threshold=0;
        let index = 0;
        for(let i =0;i<this.threshold_nodes[this.nodePos].length-1;i++){ //per tutte le soglie del nodo considerato
            threshold = this.threshold_nodes[this.nodePos][i]; //soglia i-esima
            if(value>threshold){ //se la supero, sono almeno nello stato dopo
                console.info(value+">"+threshold);
                index++; //mi sposto sullo stato successivo
            }
            else break; //esco dal ciclo quando non accade
        }
        console.info("Stato identificato:" +(index+1));
        this.statePos = index; //modifico lo stato in base alla soglia

        //la funzione sotto serve per dire alla rete che il nodo scelto è monitorabile allo stato scelto
        //per esempio se un valore è in questo momento 60 questo corrisponde allo stato "basso" del nodo "n3"
        //per dire alla rete "g" che sto "osservando" effettivamente questa cosa dico g.observe("n3","basso")
        //questo rimuove l'incertezza probabilistica sul nodo e inserisce la certezza data dall'osservazione diretta
        //(esattamente quello che ci viene richiesto con l'asssociazione di un nodo).
        this.g.observe(this.nodi[this.nodePos].name,this.states_nodes[this.nodePos][this.statePos]);
        //la chiama g.sample(#numero) serve per lanciare il "ricalcolo" e quindi avviene effettivamente l'inferenza bayesiana
        //Vengono effettuati un numero di testo pari al valore passato per paramentro e dopodichè si ottiene il valore
        //della probabilità modificata dalla presenza delle "certezze" definite come la riga precedente.
        this.g.sample(this.samples);
        //funzione che fa un output dei valori di probabilità di ogni nodo e per ogni suo stato
        this.showProb();

    }

}

//funzione di export per sfruttare l'import di questa classe
export function BayesianTab() {
    return {
        templateUrl: 'public/plugins/bayesian-graph/partials/bayesian_network.html', //struttura html a cui si appoggia
        controller: BayesianTabCtrl //associo la classe appena creata come controller che mi serve per lavorare con angular
    };
}