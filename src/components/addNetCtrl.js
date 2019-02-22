import appCtrl from "../utils/appCtrl";
class addNetCtrl{
    /** @ngInject */
    constructor($scope){
        $scope.editor = this; //mi serve per collegare html e codice della classe
        this.panelCtrl = $scope.ctrl;
        this.panel = this.panelCtrl.panel; //collega codice della classe e html
        
        console.info("addNetCtrl");
        //richiesta di una rete
        this.net = appCtrl.getNet();
        this.createBN();

    }
    createBN() {
        var rete = this.net;
        
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
        
        //variabili grafiche che memorizzano il valore scelto dall'utente a schermo
        //this.panel.samples = 10000; //numero di sample scelto
        
        //ricorda se è già stato associato un nodo oppure no
        //this.associated = false;  //true: associato / false: non associato
    }
    test(data){
        console.info(data);
    }
}

addNetCtrl.templateUrl = 'components/addNetCtrl.html';

export {addNetCtrl};
