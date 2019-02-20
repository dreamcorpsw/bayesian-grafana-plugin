import {GraphCtrl} from "./module";
//import {GraphCtrl} from "../../../../../public/app/plugins/panel/graph/module";

class BayesianGraph extends GraphCtrl { //estensione di graph da fare
    /** @ngInject */
    constructor($scope, $injector, annotationsSrv) {
        super($scope, $injector, annotationsSrv);
    }
}