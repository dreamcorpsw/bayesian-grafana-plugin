export class DreamCorpAppConfigCtrl {

  /** @ngInject */
  constructor($location){
    this.$location = $location;
  }
  redirect(){
    console.info("redirect to importNet");
    this.$location.url('plugins/dreamcorp-app/page/import-bayesian-network'); //redirecting to importNet
  }
}

DreamCorpAppConfigCtrl.templateUrl = 'components/config.html';
