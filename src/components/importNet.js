import _ from 'lodash';
import config from 'grafana/app/core/config';
import locationUtil from '../utils/location_util';
const Influx = require('../utils/Influx');
const parser = require('../utils/NetParser');
//const SyntaxChecker = require('../utils/SyntaxChecker');

//template struttura dashboard
let dashboard_template = {
    __inputs: [],
    __requires: [
        {
            type: "grafana",
            id: "grafana",
            name: "Grafana",
            version: "5.4.0"
        }
    ],
    annotations: {
        list: [
            {
                builtIn: 1,
                datasource: "-- Grafana --",
                enable: true,
                hide: true,
                iconColor: "rgba(0, 211, 255, 1)",
                name: "Annotations & Alerts",
                type: "dashboard"
            }
        ]
    },
    editable: false,
    gnetId: null,
    graphTooltip: 0,
    id: null,
    links: [],
    panels: [
        {
            type: "text",
            title: "Warning from DreamCorp",
            gridPos: {
                x: 4,
                y: 0,
                w: 16,
                h: 8
            },
            id: 0,
            mode: "markdown",
            content: "# This is a dashboard that include all the information about the net you imported. DO NOT enter edit mode because saving it would break our fecth data mechanism"
        }
    ],
    schemaVersion: 16,
    style: "dark",
    tags: ["bayesian-network"],
    templating: {
        list: [
            {
                allValue: null,
                current: {
                    text: "nodo 1",
                    value: "nodo 1"
                },
                hide: 0,
                includeAll: false,
                label: "Nodo",
                multi: false,
                name: "Nodo",
                options: [
                    {
                        selected: true,
                        text: "nodo 1",
                        value: "nodo 1"
                    }
                ],
                query: "nodo 1",
                skipUrlSync: false,
                type: "custom"
            }
        ]
    },
    time: {
        from: "now-6h",
        to: "now"
    },
    timepicker: {
        refresh_intervals: [
            "5s",
            "10s",
            "30s",
            "1m",
            "5m",
            "15m",
            "30m",
            "1h",
            "2h",
            "1d"
        ],
        time_options: [
            "5m",
            "15m",
            "1h",
            "6h",
            "12h",
            "24h",
            "2d",
            "7d",
            "30d"
        ]
    },
    timezone: "",
    title: "Rete Bayesiana",
    uid: "H39FJ39VMA12MD",
    version: 3,
    network: null
};
let dashboard_template2 = {
    __inputs: [
        {
            name: "DS_INFLUXDB-RETE",
            label: "InfluxDB-rete",
            description: "",
            type: "datasource",
            pluginId: "influxdb",
            pluginName: "InfluxDB"
        }
    ],
    __requires: [
        {
            type: "grafana",
            id: "grafana",
            name: "Grafana",
            version: "5.4.0"
        },
        {
            type: "panel",
            id: "graph",
            name: "Graph",
            version: "5.0.0"
        },
        {
            type: "datasource",
            id: "influxdb",
            name: "InfluxDB",
            version: "5.0.0"
        }
    ],
    annotations: {
        list: [
            {
                builtIn: 1,
                datasource: "-- Grafana --",
                enable: true,
                hide: true,
                iconColor: "rgba(0, 211, 255, 1)",
                name: "Annotations & Alerts",
                type: "dashboard"
            }
        ]
    },
    editable: false,
    gnetId: null,
    graphTooltip: 0,
    id: null,
    iteration: 1551364330292,
    links: [],
    panels: [
        {
            aliasColors: {},
            bars: false,
            dashLength: 10,
            dashes: false,
            datasource: "${DS_INFLUXDB-RETE}",
            fill: 1,
            gridPos: {
                h: 8,
                w: 7,
                x: 0,
                y: 0
            },
            id: 2,
            legend: {
                avg: false,
                current: false,
                max: false,
                min: false,
                show: true,
                total: false,
                values: false
            },
            lines: true,
            linewidth: 1,
            links: [],
            minSpan: 7,
            nullPointMode: "null",
            percentage: false,
            pointradius: 5,
            points: false,
            renderer: "flot",
            repeat: "nodo",
            repeatDirection: "h",
            seriesOverrides: [],
            spaceLength: 10,
            stack: false,
            steppedLine: false,
            targets: [
                {
                    groupBy: [],
                    measurement: "$nodo",
                    orderByTime: "DESC",
                    policy: "default",
                    refId: "A",
                    resultFormat: "time_series",
                    select: [
                        [
                            {
                                params: [
                                    "*"
                                ],
                                type: "field"
                            }
                        ]
                    ],
                    tags: []
                }
            ],
            thresholds: [],
            timeFrom: null,
            timeRegions: [],
            timeShift: null,
            title: "Nodo: $nodo",
            tooltip: {
                shared: true,
                sort: 0,
                value_type: "individual"
            },
            type: "graph",
            xaxis: {
                buckets: null,
                mode: "time",
                name: null,
                show: true,
                values: []
            },
            yaxes: [
                {
                    format: "short",
                    label: null,
                    logBase: 1,
                    max: null,
                    min: null,
                    show: true
                },
                {
                    format: "short",
                    label: null,
                    logBase: 1,
                    max: null,
                    min: null,
                    show: true
                }
            ],
            yaxis: {
                align: false,
                alignLevel: null
            }
        }
    ],
    refresh: false,
    schemaVersion: 16,
    style: "dark",
    tags: ["bayesian-network"],
    templating: {
        list: [
            {
                allValue: null,
                current: {
                    tags: [],
                    text: "nodo1 + nodo2 + nodo3 + nodo4 + nodo5 + nodo6",
                    value: [
                        "nodo1",
                        "nodo2",
                        "nodo3",
                        "nodo4",
                        "nodo5",
                        "nodo6"
                    ]
                },
                hide: 0,
                includeAll: false,
                label: "Nodi",
                multi: true,
                name: "nodo",
                options: [
                    {
                        selected: true,
                        text: "nodo1",
                        value: "nodo1"
                    },
                    {
                        selected: true,
                        text: "nodo2",
                        value: "nodo2"
                    },
                    {
                        selected: true,
                        text: "nodo3",
                        value: "nodo3"
                    },
                    {
                        selected: true,
                        text: "nodo4",
                        value: "nodo4"
                    },
                    {
                        selected: true,
                        text: "nodo5",
                        value: "nodo5"
                    },
                    {
                        selected: true,
                        text: "nodo6",
                        value: "nodo6"
                    }
                ],
                query: "nodo1,nodo2,nodo3,nodo4,nodo5,nodo6",
                skipUrlSync: false,
                type: "custom"
            }
        ]
    },
    time: {
        from: "2019-02-28T08:41:53.444Z",
        to: "2019-02-28T12:04:08.568Z"
    },
    timepicker: {
        refresh_intervals: [
            "5s",
            "10s",
            "30s",
            "1m",
            "5m",
            "15m",
            "30m",
            "1h",
            "2h",
            "1d"
        ],
        time_options: [
            "5m",
            "15m",
            "1h",
            "6h",
            "12h",
            "24h",
            "2d",
            "7d",
            "30d"
        ]
    },
    timezone: "",
    title: "Inference Dashboard",
    uid: "mjtTRCrmzF",
    version: 7,
    network: null
};

export class ImportNetCtrl {
    
    /** @ngInject */
    constructor(backendSrv, validationSrv, navModelSrv, $location, $routeParams) {
        this.backendSrv = backendSrv;
        this.validationSrv = validationSrv;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.step = 1;
        this.nameExists = false;
        this.uidExists = false;
        this.autoGenerateUid = true;
        this.autoGenerateUidValue = 'auto-generated';
        this.folderId =  $routeParams.folderId ? Number($routeParams.folderId) || 0 : null;
        this.initialFolderTitle = 'Select a folder';
        
        this.default_host ="http://localhost";
        this.host = this.default_host;
        this.default_port =":8086";
        this.port = this.default_port;
        this.default_database ="bayesian";
        this.database = this.default_database;
        
        
        
        // check gnetId in url
        if ($routeParams.gnetId) {
            this.gnetUrl = $routeParams.gnetId;
            this.checkGnetDashboard();
        }
        
    }
    
    setHost(host){
        this.host = host;
    }
    setPort(port){
        this.port = port;
    }
    setDatabase(database){
        this.database = database;
    }
    
    static personalizeTemplating(net,dash){
        console.info("personalizeTemplating");
        //preparo il templating
        let query = "";
        let text = "";
        let value = [];
        let options = [];
    
        let id;
    
        for(let i=0;i<net.nodi.length;i++){
            id=net.nodi[i].id;
            query+=id;
            text+=id;
            value.push(id);
            
            let option = {
                selected: true,
                text: "",
                value: ""
            };
            
            option.text = id;
            option.value = id;
            
            options.push(option);
            if(i!==net.nodi.length-1){
                query+=",";
                text+=" + ";
            }
        }
        
        //inserisco nel template i dati che mi servono per la variabile
        dash.templating.list[0].current.text=text;
        dash.templating.list[0].current.value=value;
        dash.templating.list[0].options=options;
        dash.templating.list[0].query=query;
        
        console.info(text);
        console.info(value);
        console.info(options);
        console.info(query);
    }
    static setUpDatasource(net,dash){
        dash.panels[0].datasource = "InfluxDB-"+net.id; //devo mettere il nome giusto del database qui
    }
    static boxing(net, dash){
        console.info("boxing");
        ImportNetCtrl.setUpDatasource(net,dash); //aggiungermi la datasource
        ImportNetCtrl.personalizeTemplating(net,dash); //aggiunta di variabili personalizzate template
        dash.title = net.id;
        dash.network = net; //attacco il pezzo che ricevo al template
        return dash;
    }

    onUpload(net) {
        console.info("onUpload");
        if(parser.checkSemantic(net)) {
            console.info("checkSemantic ok");
            this.network = net; //per l'html
    
            this.dash = ImportNetCtrl.boxing(net,dashboard_template2);
            /** Default after this line */
            this.dash.id = null;
            this.step = 2;
            this.inputs = [];
    
            if (this.dash.__inputs) {
                for (const input of this.dash.__inputs) {
                    const inputModel = {
                        name: input.name,
                        label: input.label,
                        info: input.description,
                        value: input.value,
                        type: input.type,
                        pluginId: input.pluginId,
                        options: [],
                    };
            
                    if (input.type === 'datasource') {
                        this.setDatasourceOptions(input, inputModel);
                    } else if (!inputModel.info) {
                        inputModel.info = 'Specify a string constant';
                    }
            
                    this.inputs.push(inputModel);
                }
            }
    
            this.inputsValid = this.inputs.length === 0;
            this.titleChanged();
            this.uidChanged(true);
        }
        else console.info("Semantic Parse Failed");
    }
    /** Default */
    setDatasourceOptions(input, inputModel) {
        const sources = _.filter(config.datasources, val => {
            return val.type === input.pluginId;
        });
        
        if (sources.length === 0) {
            inputModel.info = 'No data sources of type ' + input.pluginName + ' found';
        } else if (!inputModel.info) {
            inputModel.info = 'Select a ' + input.pluginName + ' data source';
        }
        
        inputModel.options = sources.map(val => {
            return { text: val.name, value: val.name };
        });
    }
    /** Default */
    inputValueChanged() {
        this.inputsValid = true;
        for (const input of this.inputs) {
            if (!input.value) {
                this.inputsValid = false;
            }
        }
    }
    /** Default */
    titleChanged() {
        this.titleTouched = true;
        this.nameExists = false;
        
        this.validationSrv
            .validateNewDashboardName(this.folderId, this.dash.title)
            .then(() => {
                this.nameExists = false;
                this.hasNameValidationError = false;
            })
            .catch(err => {
                if (err.type === 'EXISTING') {
                    this.nameExists = true;
                }
                
                this.hasNameValidationError = true;
                this.nameValidationError = err.message;
            });
    }
    /** Default */
    uidChanged(initial) {
        this.uidExists = false;
        this.hasUidValidationError = false;
        
        if (initial === true && this.dash.uid) {
            this.autoGenerateUidValue = 'value set';
        }
        
        this.backendSrv
            .getDashboardByUid(this.dash.uid)
            .then(res => {
                this.uidExists = true;
                this.hasUidValidationError = true;
                this.uidValidationError = `Dashboard named '${res.dashboard.title}' in folder '${
                    res.meta.folderTitle
                    }' has the same uid`;
            })
            .catch(err => {
                err.isHandled = true;
            });
    }
    /** Default */
    onFolderChange(folder) {
        this.folderId = folder.id;
        this.titleChanged();
    }
    /** Default */
    onEnterFolderCreation() {
        this.inputsValid = false;
    }
    /** Default */
    onExitFolderCreation() {
        this.inputValueChanged();
    }
    /** Default */
    isValid() {
        return this.inputsValid && this.folderId !== null;
    }
    
    saveDashboard() {
        const inputs = this.inputs.map(input => {
            return {
                name: input.name,
                type: input.type,
                pluginId: input.pluginId,
                value: input.value,
            };
        });
    
        this.dash.network.host = this.host;
        this.dash.network.port = this.port;
        this.dash.network.id = this.dash.title; //cambio effettivamente il nome della rete e la salvo
        const influx = new Influx(this.host,this.port,this.dash.network.id);
        influx.createDB() //operazione unica per rete
            .then(()=>console.info("database created"))
            .catch((err)=>console.info(err));
        
        return this.backendSrv
            .post('api/dashboards/import', {
                dashboard: this.dash,
                overwrite: true,
                inputs: inputs,
                folderId: this.folderId,
            })
            .then(res => {
                const dashUrl = locationUtil.stripBaseFromUrl(res.importedUrl);
                this.$location.url(dashUrl);
            });
    }
    
    loadJsonText() {
        try {
            this.parseError = '';
            //if(SyntaxChecker.checkSyntax(this.jsonText))
                this.onUpload(JSON.parse(this.jsonText)); //invio tutto quello che ricevo
        } catch (err) {
            console.log(err);
            this.parseError = err.message;
        }
    }
    
    /*
    checkGnetDashboard() {
        this.gnetError = '';
        
        const match = /(^\d+$)|dashboards\/(\d+)/.exec(this.gnetUrl);
        let dashboardId;
        
        if (match && match[1]) {
            dashboardId = match[1];
        } else if (match && match[2]) {
            dashboardId = match[2];
        } else {
            this.gnetError = 'Could not find dashboard';
        }
        
        return this.backendSrv
            .get('api/gnet/dashboards/' + dashboardId)
            .then(res => {
                this.gnetInfo = res;
                // store reference to grafana.com
                res.json.gnetId = res.id;
                this.onUpload(res.json);
            })
            .catch(err => {
                err.isHandled = true;
                this.gnetError = err.data.message || err;
            });
    }
    */
    
    back() {
        this.gnetUrl = '';
        this.step = 1;
        this.gnetError = '';
        this.gnetInfo = '';
    }
}
ImportNetCtrl.templateUrl = 'components/importNet.html';
