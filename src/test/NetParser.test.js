const NetParser = require('../utils/NetParser');
const jsbayes = require('jsbayes');

global.console = {
    warn: jest.fn(),
    log: jest.fn(),
    info: jest.fn()
}
console.info = jest.fn();
let parser = new NetParser(net);

let net = {
    "id": "rete",
    "samples":10000,
    "time": 10000,
    "monitored":false,
    "nodi":[
        {
            "id":"nodo1",
            "stati":["low","medium","high"],
            "soglie":[10,20,30],
            "parents":["nodo2"],
            "cpt": [[0.6258628214924593, 0.36405415319261, 0.01008302531493079],[0.3610954067790698, 0.33762667202343627, 0.3012779211974938]],
            "panel":null
        },
        {
            "id":"nodo2",
            "stati":["true","false"],
            "soglie":[20,40],
            "parents":["nodo3"],
            "cpt": [[0.6044382327022481, 0.3955617672977519],[0.7157649900901124, 0.2842350099098876]],
            "panel":null
        },
        {
            "id":"nodo3",
            "stati":["bad","good"],
            "soglie":[30,60],
            "parents":null,
            "cpt": [0.8631642493260351, 0.13683575067396492],
            "panel":null
        },
        {
            "id":"nodo4",
            "stati":["no_good","ok","very_good"],
            "soglie":[12,25,33],
            "parents":null,
            "cpt": [0.4512762373734294, 0.5434887504061748, 0.0052350122203957804],
            "panel":null
        },
        {
            "id":"nodo5",
            "stati":["this","is","a","test"],
            "soglie":[21,69,80,140],
            "parents":["nodo4"],
            "cpt": [[0.30597763739386946, 0.15226289961186734, 0.24655387222057132, 0.2952055907736919],[0.22985255764260748, 0.28557940107221036, 0.22452634865860713, 0.26004169262657506],[0.1246435494154197, 0.23870889457674507, 0.0975142864409743, 0.5391332695668609]],
            "panel":null
        },
        {
            "id":"nodo6",
            "stati":["How","many","threshold","do","you","want","question"],
            "soglie":[12,20,40,60,90,145,150],
            "parents":["nodo3","nodo5"],
            "cpt": [
                [0.1551143822998854, 0.2012693384218669, 0.18891294824720137, 0.15036282037173826, 0.19926636975235787, 0.06112998086412207, 0.04394416004282816],
                [0.1581001042696514, 0.26001911048129756, 0.06433504089449826, 0.16397807823542376, 0.09348378242885448, 0.057510513886464366, 0.20257336980381022],
                [0.002058518165719992, 0.062087155478333156, 0.2093754907527521, 0.24588219185552967, 0.3501091932978672, 0.07612673955391185, 0.05436071089588593],
                [0.03516602669604393, 0.333403763371422, 0.05364984815211845, 0.05017169916399654, 0.33065881637057387, 0.19010338217683304, 0.006846464069012212],
                [0.2478085182884388, 0.28586281218738896, 0.04202180358120712, 0.007412188135090316, 0.24546710663794682, 0.1202909237320112, 0.051136647437916925],
                [0.26318343859582305, 0.05236772117618722, 0.00939920867174532, 0.3406598788833027, 0.1516180563802434, 0.04317130283431753, 0.1396003934583807],
                [0.23804102855053522, 0.12140625558071365, 0.12221149988308665, 0.13094938149454838, 0.0735416799112094, 0.1271432207846926, 0.1867069337952141],
                [0.006119290052600249, 0.042024780350724066, 0.10164888479058756, 0.3201266362081952, 0.0809894931308723, 0.2641934191185382, 0.1848974963484824]
            ],
            "panel":null
        }
    ]
};



it("Should call console.info" , () => {
    expect(console.info).toBeCalledWith("NetParser()")
});

let i, j;
let nodes = []; //array di nodi ritornati dalla creazione di nodi con jsbayes, serve per collegare ai padri successivamente
//addNode
let logicNet = jsbayes.newGraph();
for (i = 0; i < net.nodi.length; i++) {
    if(NetParser.isOk(net.nodi[i])){
        //console.info("node: "+jsonNet.nodi[i].id+" ok");
        nodes.push(logicNet.addNode(net.nodi[i].id, net.nodi[i].stati)); //aggiungo un nuovo nodo logico della rete bayesiana al graph
    }
}

it("Testing getParentIndex, ritorna l'indice del nodo padre dato il nome di un nodo", () => {

    expect(NetParser.getParentIndex("nodo1  ",nodes)).toEqual(-1);

    expect(NetParser.getParentIndex("nodo3",nodes)).toEqual(2);
});

let prob_true = [0.4, 0.6 ]
let prob_false = [0.5, 0.6]

it("Testing sum probability", () => {

    expect(NetParser.checkNormalize(prob_true)).toEqual(true);

    expect(NetParser.checkNormalize(prob_false)).toEqual(false);
});


