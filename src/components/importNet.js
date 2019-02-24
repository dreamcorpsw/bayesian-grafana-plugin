import _ from 'lodash';
import config from 'grafana/app/core/config';
import locationUtil from '../utils/location_util';

let structure2 = {
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
        list: []
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
    title: "adasdasd",
    uid: "sdoasnronorf",
    version: 2,
    network: null
};

export class ImportNetCtrl {
    
    /** @ngInject */
    constructor(backendSrv, validationSrv, navModelSrv, $location, $routeParams) {
        //this.navModel = navModelSrv.getNav('create', 'import');
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
        
        // check gnetId in url
        if ($routeParams.gnetId) {
            this.gnetUrl = $routeParams.gnetId;
            this.checkGnetDashboard();
        }
    }
    
    onUpload(dash) {
        this.dash = dash;
        this.dash.id = null;
        this.step = 2;
        this.inputs = [];

        console.info("onUpload" + this.dash.network); //*****************************
        
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
    
    inputValueChanged() {
        this.inputsValid = true;
        for (const input of this.inputs) {
            if (!input.value) {
                this.inputsValid = false;
            }
        }
    }
    
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
    
    onFolderChange(folder) {
        this.folderId = folder.id;
        this.titleChanged();
    }
    
    onEnterFolderCreation() {
        this.inputsValid = false;
    }
    
    onExitFolderCreation() {
        this.inputValueChanged();
    }
    
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
            //const dbnet = structure+this.jsonText+"\n}";
            //const json = JSON.parse(dbnet);
            //this.onUpload(json);
            console.info("pre parsing: " + structure2.panels[0].title);
            structure2.network = JSON.parse(this.jsonText); //questo funziona quasi
            console.info("post parsing: " + structure2.network.nodi[0].id);
            this.onUpload(structure2);
            
        } catch (err) {
            console.log(err);
            this.parseError = err.message;
            return;
        }
    }
    
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
    
    back() {
        this.gnetUrl = '';
        this.step = 1;
        this.gnetError = '';
        this.gnetInfo = '';
    }
}
ImportNetCtrl.templateUrl = 'components/importNet.html';
