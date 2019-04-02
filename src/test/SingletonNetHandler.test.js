const jsbayes = require('jsbayes');

let logic = require("../utils/LogicNetBuilder");
let wrong_net = require("../networks/wrong.network");
let net = require("../networks/rete.json");
let net2 = require("../networks/rete2.json");

let Handler = require("../utils/SingletonNetHandler");

let handlerTest = new Handler();

test("Verify initial status", () => {

    expect(handlerTest.getInstance().networks).toEqual([]);
    expect(handlerTest.getInstance().dashboards).toEqual([]);
    expect(handlerTest.getInstance().backend).toEqual(null);
    expect(handlerTest.getInstance().bayesian_graphs).toEqual([]);
});


let bayesianTest = [net,net2];

test("Verify correct bayesian graph index", () => {
    Handler.instance.bayesian_graphs = bayesianTest;
    expect(Handler.instance.find(net)).toEqual(0);
    expect(Handler.instance.find(net2)).toEqual(1);
});



