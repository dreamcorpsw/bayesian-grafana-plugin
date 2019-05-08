import _ from 'lodash';
import config from 'grafana/app/core/config';
import locationUtil from '../utils/location_util';
import {appEvents} from "grafana/app/core/core";
const InfluxProxy = require('../utils/InfluxProxy');

//template struttura dashboard
let dashboard_template = {
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
    refresh: "10s",
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
        from: "now-5m",
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
    title: "Inference Dashboard",
    uid: "mjtTRCrmzFds2",
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
        this.default_password = "";
        this.password = this.default_password;
        this.default_user = "";
        this.user = this.default_user = "";
        
        this.datasource = null;
        
        //this.default_database ="bayesian";
        //this.database = this.default_database;
        /*
        // check gnetId in url
        if ($routeParams.gnetId) {
            this.gnetUrl = $routeParams.gnetId;
            this.checkGnetDashboard();
        }*/
        
    }
    
    //metodi per settare i campi dati relativi al salvataggio dati
    setHost(host){
        this.host = host;
    }
    setPort(port){
        this.port = port;
    }
    setUser(user){
        this.user = user;
    }
    setPassword(password){
        this.password = password;
    }
    
    personalizeTemplating(net,dash){
        
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
    }
    
    setUpDatasource(net,dash){
        dash.panels[0].datasource = "InfluxDB-"+net.id;
    }
    
    //creo quando dopo l'esecuzione di Savedashboard
    createDatasource(net,dash){
        
        //let Url = this.host+this.port;
        //let password = "Ghi8dav97!";
        //let user = "admin";
        const payload = {
            name:"InfluxDB-"+net.id,
            type:"influxdb",
            access:"proxy",
            url:this.host+this.port,
            password:this.password,
            user:this.user,
            database:net.id,
            basicAuth:false,
            withCredentials:false,
            isDefault:false,
            version:3,
            readOnly:false
        };
        
        return this.backendSrv.post('/api/datasources/',payload)
            .then((ds)=>{
                this.datasource = ds;
                dash.panels[0].datasource = ds.name;
                return ds;
            })
            .catch((err)=>console.info(err));
    }
    
    
    boxing(net, dash){
        this.personalizeTemplating(net,dash); //aggiunta di variabili personalizzate template
        this.setUpDatasource(net,dash); //aggiunge la datasource
        dash.title = net.id; //aggiorno per vedere a schermo il nome della rete
        dash.network = net; //attacco la struttura della rete
        return dash;
    }
    
    //crea un database con il nome uguale a quello della rete importata
    createDB(){
        const influx = new InfluxProxy(this.host,this.port,this.dash.network.id);
        influx.createDB()
            .then(()=>{
                appEvents.emit('alert-success', ['Database created', '']);
            })
            .catch((err)=>{
                appEvents.emit('alert-error', ['Database creation error', err]);
            });
    }
    
    //controlla che sia corretta semanticamente
    //restituisce true o false
    checkSematic(net){
        const parser = require('../utils/NetParser');
        return parser.checkSemantic(net);
    }
    
    onUpload(net) {
        console.info("onUpload");
        if(this.checkSematic(net)) {

            this.network = net; //per la visualizzazione html
    
            //preparo la dashboard con il boxing templetizzato
            this.dash = this.boxing(net,dashboard_template);
            
            //default
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
                    this.inputs[0].value = "InfluxDB-"+this.dash.network.id;
                }
            }
            
            this.inputsValid = this.inputs.length === 0;
            
            this.inputValueChanged();
            this.titleChanged();
            this.uidChanged(true);
        }
    }
    
    addDatasourceOption(){
        let datasources = config.datasources;
        //template options for the datasource
        const options = {
            id: this.datasource.id,
            name: this.datasource.name,
            type: "influxdb",
            database: this.network.id,
            jsonData: {
                keepCookies: []
            },
            url: "/api/datasources/proxy/"+this.datasource.id,
            meta:{
                alerting: true,
                annotations: true,
                baseUrl: "public/app/plugins/datasource/influxdb",
                dependencies:{
                    grafanaVersion: "*",
                    plugins: []
                },
                explore: false,
                hasQueryHelp: true,
                id: "influxdb",
                includes: null,
                info: {
                    author: {
                        name: "Grafana Project",
                        url: "https://grafana.com"
                    },
                    description: "InfluxDB Data Source for Grafana",
                    links: null,
                    logos: {
                        small: "public/app/plugins/datasource/influxdb/img/influxdb_logo.svg",
                        large: "public/app/plugins/datasource/influxdb/img/influxdb_logo.svg"
                    },
                    screenshots: null,
                    updated: "",
                    version: "5.0.0"
                },
                logs: false,
                metrics: true,
                module: "app/plugins/datasource/influxdb/module",
                name: "InfluxDB",
                queryOptions: {
                    minInterval: true
                },
                routes: null,
                type: "datasource"
            }
        };
    
        datasources[this.datasource.name] = options;
    }
    /** Default */
    setDatasourceOptions(input, inputModel) {
        /** default */
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
        
        this.dash.network.id = this.dash.title; //quello che vedo a schermo lo assegno alla struttura della rete
        
        //creo la datasource
        this.createDatasource(this.dash.network,this.dash)
            .then(()=>{
                
                this.addDatasourceOption();
                //inputs preparation
                this.inputs[0].value = this.datasource.name; //aggiorno il valore della dashboard
                const inputs = this.inputs.map(input => {
                    return {
                        name: input.name,
                        type: input.type,
                        pluginId: input.pluginId,
                        value: input.value,
                    };
                });
                //*********
                
                //power up of the net structure with some useful information
                let network_structure = {
                    id: this.dash.title,
                    host: this.host,
                    port: this.port,
                    samples: 10000,
                    time: 10000,
                    monitored: false,
                    nodi: this.dash.network.nodi
                };
                
                this.dash.network = network_structure; // new boxing
                //**********
                
                //this.setUpDatasource(this.dash.network,this.dash); //set up again to update
                //datasource setting
                this.dash.panels[0].datasource = this.datasource.name; //sistemo il nome della datasource
                //*******
                
                //creo il database
                this.createDB();
                //***********
                
                /** TESTING OUT
                console.info("saving: ");
                let dash = this.dash;
                let network = this.dash.network;
                let datasource = this.dash.panels[0].datasource;
                console.info({dash,network,datasource});
                */
                
                //salvo la dashboard
                return this.backendSrv
                    .post('api/dashboards/import', {
                        dashboard: this.dash,
                        overwrite: true,
                        inputs: inputs,
                        folderId: this.folderId,
                    })
                    .then(dash => {
                        const dashUrl = locationUtil.stripBaseFromUrl(dash.importedUrl);
                        this.$location.url(dashUrl);
                    })
                    .catch((err)=>{
                        appEvents.emit('alert-error', ['Network saving failed', err]);
                    });
            })
            .catch((err)=>console.info(err));
    }
    
    loadJsonText() {
        try {
            this.parseError = '';
            this.onUpload(JSON.parse(this.jsonText)); //invio tutto quello che ricevo
        } catch (err) {
            console.log(err);
            this.parseError = err.message;
        }
    }
    
    back() {
        this.gnetUrl = '';
        this.step = 1;
    }
}
ImportNetCtrl.templateUrl = 'components/importNet.html';
