const jsbayes = require('jsbayes');
//classe per poter parsare efficacemente una rete bayesiana
class NetParser{
    constructor(jsonNet){
        console.info("NetParser()");
        this.jsonNet = jsonNet;
        this.logicNet = null;
        this.hasErrors = false;
        //console.info(jsonNet);
        //this.parse();
    }
    //find a parent index for a node
    static getParentIndex(parentName, nodes){
        let indexParent = -1;
        for(let k=0;k<nodes.length;k++){
            if(parentName === nodes[k].name)
                indexParent = k;
        }
        return indexParent;
    }
    //check for logic order in the thresholds: ascending order is the only admitted, possible reordering
    static ascendingOrder(thresholds){
        for (let i=0;i<thresholds.length-1;i++){
            if(thresholds[i]>thresholds[i+1]){
                console.info("Not ascending order in the thresholds given: ");
                console.info("threshold " + i + " > " + " threshold "+ (i+1));
                console.info(thresholds[i] + " > " + thresholds[i+1]);
                console.info("If you want automatic reordering please go to import bayesian network page and check the options"); //optional
                return false;
            }
        }
        return true;
    }
    //return the result of the check: true, the values are the exact number
    static isOk(node){
        return ((node.stati.length === node.soglie.length) && NetParser.ascendingOrder(node.soglie));
        //numero di stati e soglie uguale e poi che le soglie siano in ordine crescente
    }
    static controlNameNodes(jsonNet){
        for(let i = 0; i < jsonNet.nodi.length; i++){
            for(let j = 0; j < jsonNet.nodi.length; j++){
                if(j!==i && jsonNet.nodi[i].id===jsonNet.nodi[j].id){
                    console.info("Duplicate id between node n°" + i + " and node n°" + j + " with id="+jsonNet.nodi[j].id);
                    return true;
                }
            }
        }
        return false;
    }
    
    static checkNormalize(probabilities){
        let sum = 0;
        for(let i=0;i<probabilities.length;i++)
            sum+=probabilities[i];
        console.info(sum);
        return sum===1;
    }
    //check logic on cpt
    static checkCpt(NparentsStates,cpt){
        if(NparentsStates === 1) return cpt.length === 1 && NetParser.checkNormalize(cpt[0]); //nessun genitore
        else { //ho dei genitori
            if(NparentsStates !== cpt.length) return false;
            for(let i=0;i<cpt.length;i++){
                if(NetParser.checkNormalize(cpt[i])){
                    console.info("Not normalized probability"); //da migliorare la precisione
                    return false;
                }
            }
            return true;
        }
    }
    
    //adding nodes and relative parents
    parse() {
        
        //new Bayesian Net
        this.logicNet = jsbayes.newGraph();
        
        //init vars
        let i, j;
        let nodes = []; //array di nodi ritornati dalla creazione di nodi con jsbayes, serve per collegare ai padri successivamente
        this.hasErrors = NetParser.controlNameNodes(this.jsonNet); //check for future
        
        //addNode
        for (i = 0; i < this.jsonNet.nodi.length; i++) {
            if(NetParser.isOk(this.jsonNet.nodi[i])){
                //console.info("node: "+jsonNet.nodi[i].id+" ok");
                nodes.push(this.logicNet.addNode(this.jsonNet.nodi[i].id, this.jsonNet.nodi[i].stati)); //aggiungo un nuovo nodo logico della rete bayesiana al graph
            }
            else this.hasErrors = true; //stop for the future, but not the cycle
        }
        
        //future operations check
        //console.info(this.hasErrors);
        if(!this.hasErrors){
            //init vars
            let indexParent,node,NparentsStates; //index for the parent search
            //addParent
            for (i=0;i<this.jsonNet.nodi.length;i++) {
                node = this.jsonNet.nodi[i];
                NparentsStates = 1;
                //check num parents
                if (node.parents !== null) {
                    for (j = 0; j < node.parents.length; j++) {
                        indexParent = NetParser.getParentIndex(node.parents[j], nodes);
                        if (indexParent !== -1) {  //check for mistake
                            nodes[i].addParent(nodes[indexParent]);
                            NparentsStates*=this.jsonNet.nodi[indexParent].stati.length;
                        }
                        else {
                            console.info("Missing parent n°" + j + " for node: " + node.name);
                            this.hasErrors = true;
                        }
                    }
                }
                /*
                //finiti tutti i genitori conto il numero di stati di tutti moltiplicati e glielo passo alla funzione di controllo
                if(NetParser.checkCpt(NparentsStates,jsonNet.nodi[i].cpt))
                    nodes[i].setCpt(jsonNet.nodi[i].cpt); //setting the cpt
                else {
                    this.hasErrors = true;
                    console.info("node :"+i+" has problem on his cpt");
                }*/
                
                //nessun controllo per ora
                nodes[i].setCpt(this.jsonNet.nodi[i].cpt); //setting the cpt
            }
    
            /*
            //set random cpt
            if (!this.hasErrors)
                return this.setRandomCpt()
                    .catch((err)=> console.info(err));
             */
            return this.logicNet;
        }
        else return null;
    }
    
    /*
    //set random conditional probability tables
    setRandomCpt(){
        return this.g.reinit()
            .then(()=>this.g.sample(10000)
                .then(()=> {
                    console.info(this.g);
                    return this.g
                })
            ) //sampling to fix probabilities in the nodes
            .catch((err)=> console.info(err)); //catch for the errors
    } */
    /*
    //returns the net if there are no errors, returns null instead
    getLogicNet(){
        //if(this.logicNet !== null) return this.logicNet; //if already exists, return it
        //if(this.g !== null) return this.g;
        if(this.jsonNet !== null){ //not empty json
            return this.parse(this.jsonNet)
                .then(()=>{
                    if(!this.hasErrors)
                        return this.g;
                    else{
                        console.info("hasErrors => returning null");
                        return null;
                    }
                })
                .catch((err)=>console.info(err));
        }
        else return null;
    }
    */
}

module.exports=NetParser;
