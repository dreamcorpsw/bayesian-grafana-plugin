const jsbayes = require('jsbayes');

class LogicNetBuilder{
    constructor(){
        console.info("LogicNetBuilder");
        this.logicNet = null;
        this.logicNets = [];
    }
    static getParentIndex(parentName, nodes){
        let indexParent = -1;
        for(let k=0;k<nodes.length;k++){
            if(parentName === nodes[k].name)
                indexParent = k;
        }
        return indexParent;
    }
    buildLogicNet(net){
        this.logicNet = jsbayes.newGraph();
        
        let i, j;
        let nodes = []; //array di nodi ritornati dalla creazione di nodi con jsbayes, serve per collegare ai padri successivamente
        
        //nodes
        for (i = 0; i < net.nodi.length; i++) {
            nodes.push(this.logicNet.addNode(net.nodi[i].id, net.nodi[i].stati)); //aggiungo un nuovo nodo logico della rete bayesiana al graph
        }
        
        let indexParent,node; //index for the parent search
        //addParent
        for (i=0;i<net.nodi.length;i++) {
            node = net.nodi[i];
            //check num parents
            if (node.parents !== null) {
                for (j = 0; j < node.parents.length; j++) {
                    indexParent = LogicNetBuilder.getParentIndex(node.parents[j], nodes);
                    nodes[i].addParent(nodes[indexParent]);
                }
            }
            //nessun controllo per ora
            nodes[i].setCpt(net.nodi[i].cpt); //setting the cpt
        }
        
        return this.logicNet;
    }
    buildAllNets(nets){
        this.logicNets = [];
        for(let i=0;i<nets.length;i++)
            this.logicNets.push(this.buildLogicNet(nets[i]));
        return this.logicNets;
    }
}

module.exports = new LogicNetBuilder();