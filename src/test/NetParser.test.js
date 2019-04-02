

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

let parser = NetParser.constructor;
NetParser.checkSemantic(net);
let i, j;
let nodes = []; //array di nodi ritornati dalla creazione di nodi con jsbayes, serve per collegare ai padri successivamente
// addNode
let logicNet = jsbayes.newGraph();
for (i = 0; i < net.nodi.length; i++) {
    if (parser.isOk(net.nodi[i])) {
        //console.info("node: "+jsonNet.nodi[i].id+" ok");
        nodes.push(logicNet.addNode(net.nodi[i].id, net.nodi[i].stati)); //aggiungo un nuovo nodo logico della rete bayesiana al graph
    }

}





/*test("Testing getParentIndex, ritorna l'indice del nodo padre dato il nome di un nodo", () => {


    expect(parser.getParentIndex("nodo1  ",nodes)).toEqual(-1);

    expect(parser.getParentIndex("nodo7",nodes)).toEqual(2);
});*/

test("Should check if thresholds are in ascending order", () => {
    let ascending_true=[1,2,3]
    let ascending_false=[3,2,1]
    expect(parser.ascendingOrder(ascending_false)).toEqual(false);
    expect(parser.ascendingOrder(ascending_true)).toEqual(true);
});

test("Return the result of the check: true, the values are the exact number", () => {

    expect(parser.isOk(wrong_net.nodi[0])).toEqual(false);
    expect(parser.isOk(net.nodi[0])).toEqual(true)
});

test("Controls nodes names", () => {
    expect(parser.controlNameNodes(net)).toEqual(false);
    expect(parser.controlNameNodes(wrong_net)).toEqual(true);
});

test("Testing sum probability", () => {

    let prob_true = [0.4, 0.6 ]
    let prob_false = [0.5, 0.6]

    //expect(parser.checkNormalize(prob_false)).toEqual(false);
    expect(parser.checkNormalize(prob_true)).toEqual(true);


});
/*
test("Testing checkCpt", () => {
    expect(NetParser.checkCpt(3,net.nodi[0].cpt)).toEqual(false)
});

test("Testing parse", () => {
    expect(wrong_parser.parse()).toEqual(null)
});
*/




test("test TBA", () => {
    expect(NetParser.checkSemantic(wrong_net)).toEqual(false);
    expect(NetParser.checkSemantic(net)).toEqual(true);
});

