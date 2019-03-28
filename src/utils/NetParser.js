//classe per poter parsare efficacemente una rete bayesiana
class NetParser{
    constructor(){
        console.info("NetParser()");
        this.jsonNet = null;
        this.hasErrors = false;
    }
    //find a parent index for a node
    static getParentIndex(parentName, nodes){
        let indexParent = -1;
        for(let k=0;k<nodes.length;k++){
            if(parentName === nodes[k].id)
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
        return sum>=0.99;
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
    checkSemantic(text_net) {
        console.info("checkSemantic()");
        this.jsonNet = text_net;
        
        //init vars
        let i, j;
        this.hasErrors = NetParser.controlNameNodes(this.jsonNet); //check for future
        
        //addNode
        for (i = 0; i < this.jsonNet.nodi.length; i++) {
            if(!NetParser.isOk(this.jsonNet.nodi[i])){
                this.hasErrors = true; //stop for the future, but not the cycle
                return false;
            }
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
                        indexParent = NetParser.getParentIndex(node.parents[j], this.jsonNet.nodi);
                        if (indexParent !== -1) {  //check for mistake
                            //nodes[i].addParent(nodes[indexParent]);
                            NparentsStates*=this.jsonNet.nodi[indexParent].stati.length;
                        }
                        else {
                            console.info("Missing parent n°" + j + " for node: " + node.id);
                            this.hasErrors = true;
                            return false;
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
                }
                */
            }
    
        }
        else return false;
        
        return true;
    }
}

module.exports= new NetParser();
