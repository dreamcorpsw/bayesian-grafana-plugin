class addNetCtrl{
    /** @ngInject */
    constructor(){
        console.info("addNetCtrl");
    }
    test(data){
        console.info(data);
    }
}


addNetCtrl.templateUrl = 'components/addNetCtrl.html';

export {addNetCtrl};
