const Looper = require('../utils/Looper');
export class Control{
    /** @ngInject */
    constructor($scope,backendSrv,$location){
        console.info("Control()");
        this.$location = $location;
        this.backendSrv = backendSrv;
        this.panel = $scope.ctrl.panel;
        this.onInitData();
        this.searchNets()
            .then(()=>this.importNets()
                .then(()=>{
                    //console.info("done importing nets");
                    this.setDataFromNets();
                })
            )
            .catch((err)=>console.info(err));
    }
    
    onInitData(){
        this.samples = []; //contenitore per il numero di sample
        this.time = []; //contenitore per i tempi di refresh
        this.uids = []; //contenitore degli UID delle reti bayesiane
        this.networks = []; //contenitore strutture reti bayesiae
        this.dashboards = []; //contenitore per le dashboard da salvare
        this.hasStarted = [];
    }
    
    searchNets(){
        //console.info("searchNets()");
        return this.backendSrv.get('/api/search?tag=bayesian-network')
            .then(res =>{
                this.uids = res;
                console.info(this.uids);
            })
            .catch(err=>console.log(err));
    }
    async importSingleNet(uid) {
        return await this.backendSrv
            .getDashboardByUid(uid)
            .then(res => {
                this.dashboards.push(res.dashboard);
                this.networks.push(res.dashboard.network);
            })
            .catch(err => {
                err.isHandled = true;
            });
    }
    importNets() {
        //this.dashboards = []; //reset
        this.networks = []; //reset
        const promises = this.uids.map(uid_container => this.importSingleNet(uid_container.uid));
        return Promise.all(promises); //synchro
    }
    save(index) {
        return this.backendSrv
            .post('api/dashboards/import', {
                dashboard: this.dashboards[index],
                overwrite: true,
                folderId: 0,
            })
            .then(()=>console.info("saved"))
            .catch((err)=>console.info(err));
    }
    
    setDataFromNets(){
        let monitored,sample,time;
        for(let i=0;i<this.networks.length;i++) {
            monitored = this.networks[i].monitored;
            if(monitored!==null)
                this.hasStarted.push(monitored); //qui se è true devo azionare automaticamente Looper
            else this.hasStarted.push(false);
            
            sample = this.networks[i].samples;
            if(sample!==null)
                this.samples.push(sample);
            else this.samples.push(10000);
            
            time = this.networks[i].time;
            if(time!==null)
                this.time.push(time);
            else this.time.push(10000);
        }
    }
    
    setSamples(value,i){
        if(value!==null) this.samples[i] = value;
    }
    setTime(time,i){
        if(time!==null) this.time[i] = time;
    }
    //starts the monitoring on the specified net
    start(index){
        this.hasStarted[index] = true;
        this.networks[index].monitored=true;
        this.networks[index].time = this.time[index];
        this.networks[index].samples = this.samples[index];
        //save & start
        this.save(index)
            .then(()=>{
                Looper.setBackendSrv(this.backendSrv);
                Looper.start(this.networks[index],this.time[index]);
            });
    }
    //stop the monitoring on the specified net
    stop(index){
        this.hasStarted[index] = false;
        this.networks[index].monitored=false;
        //save & stop
        this.save(index)
            .then(()=>{
                Looper.setBackendSrv(this.backendSrv);
                Looper.stop(this.networks[index]);
            });
    }
    redirect(){
        this.$location.url('plugins/dreamcorp-app/page/import-bayesian-network'); //redirecting to importNet
    }
}
Control.templateUrl = 'components/control.html';