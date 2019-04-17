import {BayesianTab} from "./bayesian_tab";
import {GraphCtrl} from "../graph/module";
const SingletonNetHandler = require('../../utils/SingletonNetHandler');

class BayesianGraphCtrl extends GraphCtrl{
    /** @ngInject*/
    constructor($scope, $injector, annotationsSrv, backendSrv) {
        super($scope, $injector, annotationsSrv);
        this.events.on('init-edit-mode', this.onInitBayesianPanelEditMode.bind(this));
        $scope.ctrl.panel.title = "Bayesian Graph";
        this.backendSrv = backendSrv;
        this.NetHandler = new SingletonNetHandler().getInstance();
        this.NetHandler.add(this);
    }
    async update(){
        this.nets = this.NetHandler.getAllNets();
    }
    modify(net){
        console.info("BayesianGraph: modify()");
        this.NetHandler.modify(net);
    }
    onInitBayesianPanelEditMode() {
        this.update()
            .then(()=> {
                    this.addEditorTab('Bayesian Network', BayesianTab);
                }
            );
    }
}

BayesianGraphCtrl.templateUrl = 'public/plugins/dreamcorp-app/panels/bayesian-graph/module.html';
export {
    BayesianGraphCtrl as PanelCtrl
};

