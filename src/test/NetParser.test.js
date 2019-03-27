/*

const NetParser = require('../utils/NetParser');
const jsbayes = require('jsbayes');

global.console = {
    warn: jest.fn(),
    log: jest.fn(),
    info: jest.fn()
}
console.info = jest.fn();
let wrong_net = require("../networks/wrong.network")
let net = require("../networks/rete.json")



NetParser.checkSemantic(net);

let i, j;
let nodes = []; //array di nodi ritornati dalla creazione di nodi con jsbayes, serve per collegare ai padri successivamente
// addNode
let logicNet = jsbayes.newGraph();
for (i = 0; i < net.nodi.length; i++) {
    if (NetParser.isOk(net.nodi[i])) {
        //console.info("node: "+jsonNet.nodi[i].id+" ok");
        nodes.push(logicNet.addNode(net.nodi[i].id, net.nodi[i].stati)); //aggiungo un nuovo nodo logico della rete bayesiana al graph
    }

}

test("Should call console.info" , () => {
    expect(console.info).toBeCalledWith("NetParser()")
});



test("Testing getParentIndex, ritorna l'indice del nodo padre dato il nome di un nodo", () => {



    expect(NetParser.getParentIndex("nodo1  ",nodes)).toEqual(-1);

    expect(NetParser.getParentIndex("nodo3",nodes)).toEqual(2);
});

test("Should check if thresholds are in ascending order", () => {
    let ascending_true=[1,2,3]
    let ascending_false=[3,2,1]
    expect(NetParser.ascendingOrder(ascending_false)).toEqual(false);
    expect(NetParser.ascendingOrder(ascending_true)).toEqual(true);
});

test("Return the result of the check: true, the values are the exact number", () => {

    expect(NetParser.isOk(wrong_net.nodi[0])).toEqual(false);
    expect(NetParser.isOk(net.nodi[0])).toEqual(true)
});

test("Controls nodes names", () => {
    expect(NetParser.controlNameNodes(net)).toEqual(false);
    expect(NetParser.controlNameNodes(wrong_net)).toEqual(true);
});

test("Testing sum probability", () => {

    let prob_true = [0.4, 0.6 ]
    let prob_false = [0.5, 0.6]


    expect(NetParser.checkNormalize(prob_true)).toEqual(true);

    expect(NetParser.checkNormalize(prob_false)).toEqual(false);
});

test("Testing checkCpt", () => {
    expect(NetParser.checkCpt(3,net.nodi[0].cpt)).toEqual(false)
});

test("Testing parse", () => {
    expect(wrong_parser.parse()).toEqual(null)
});
*/
