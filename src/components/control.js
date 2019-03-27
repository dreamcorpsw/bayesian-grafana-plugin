const Looper = require('../utils/Looper');
const DashboardLoader = require('../utils/DashboardLoader');
export class Control{
    /** @ngInject */
    constructor($scope,backendSrv,$location){
        this.$location = $location;
        this.backendSrv = backendSrv;
        this.panel = $scope.ctrl.panel;
        this.onInitData();
    }
    onInitData(){
        this.samples = []; //contenitore per il numero di sample
        this.time = []; //contenitore per i tempi di refresh
        this.networks = []; //contenitore strutture reti bayesiae
        this.dashboards = []; //contenitore per le dashboard da salvare
        this.hasStarted = [];
        
        let loader = new DashboardLoader(this.backendSrv);
        loader.getDashboards((res)=>{
            this.dashboards = res;
            this.networks = loader.extract(res);
        });
    }
    save(index) {
        return this.backendSrv
            .post('api/dashboards/import', {
                dashboard: this.dashboards[index],
                overwrite: true,
                folderId: 0,
            })
            //.then(()=>console.info("saved"))
            .catch((err)=>console.info(err));
    }
    setDataFromNets(){
        let monitored,sample,time;
        for(let i=0;i<this.networks.length;i++) {
            
            monitored = this.networks[i].monitored;
            if(monitored!==null)
                this.hasStarted.push(monitored); //qui se è true devo azionare automaticamente Looper
            else this.hasStarted.push(false);
            
            //this.hasStarted.push(false); //quando aggiorna ripartono sempre
            
            sample = this.networks[i].samples;
            if(sample!==null)
                this.samples.push(sample);
            else this.samples.push(10000);
            
            time = this.networks[i].time;
            if(time!==null)
                this.time.push(time);
            else this.time.push(10000);
            
            /* partenza automatica
            if(this.hasStarted[i]===true) //funziona ma se ritorno sulla pagina riattiva un altro loop
                this.start(i);
                */
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
                Looper.start(this.networks[index],index);
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
                Looper.stop(this.networks[index],index);
            });
    }
    redirect(){
        this.$location.url('plugins/dreamcorp-app/page/import-bayesian-network'); //redirecting to importNet
    }
}
Control.templateUrl = 'components/control.html';