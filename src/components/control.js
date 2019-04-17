const Looper = require('../utils/Looper');
const DashboardLoader = require('../utils/DashboardLoader');
const InfluxProxy = require('../utils/InfluxProxy');
export class Control{
    /** @ngInject */
    constructor($scope,backendSrv,$location){
        this.$location = $location;
        this.backendSrv = backendSrv;
        this.panel = $scope.ctrl.panel;
        this.loader = new DashboardLoader(backendSrv);
        this.onInitData();
        this.load();
    }
    
    load(){
        this.loader.getDashboards()
            .then((res)=>{
                this.dashboards = res;
                this.networks = this.loader.extract(res);
                console.info(this.networks);
                this.setDataFromNets();
                this.wait();
            });
    }
    /*
    async asynchro(){
        return "waitForMe";
    }
    waitForMe(){
        return this.asynchro().then((msg)=>{
                return msg;
        });
    }*/
    wait(){ //per ora questa funzione ci salva, ci permette di visualizzare this.networks
        this.backendSrv.get('/api/search?');
    }
    
    onInitData(){
        this.samples = []; //contenitore per il numero di sample
        this.time = []; //contenitore per i tempi di refresh
        this.networks = []; //contenitore strutture reti bayesiae
        this.dashboards = []; //contenitore per le dashboard da salvare
        this.hasStarted = [];
    }
    
    save(index) {
        /*
        return this.backendSrv
            .post('api/dashboards/import', {
                dashboard: this.dashboards[index],
                overwrite: true,
                folderId: 0,
            })
            .catch((err)=>console.info(err));
        */
        let options = {
            overwrite : true
        };
        return this.backendSrv.saveDashboard(this.dashboards[index],options); //in teoria si può semplificare di brutto
    }
    setDataFromNets(){
        let monitored,sample,time;
        for(let i=0;i<this.networks.length;i++) {
            console.info(this.networks[i].id);
            monitored = this.networks[i].monitored;
            
            if(monitored){
                this.hasStarted.push(monitored); //qui se è true devo azionare automaticamente Looper
            }
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
            
            /* partenza automatica pericolosa perchè ogni volta che passo sulla pagina rilancia il loop
            if(this.hasStarted[i]===true) //funziona ma se ritorno sulla pagina riattiva un altro loop
                //devo cercare di capire se è già attivo un loop per quella pagina
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
    
    delete(index){
        this.stop(index);
        let uid = this.dashboards[index].uid;
        this.networks.splice(index,1);
        
        //**********
        //da testare
        let influx = new InfluxProxy(this.networks.host,this.networks.port,this.networks.id);
        influx.drop()
            .then(()=>{
                return this.backendSrv.deleteDashboard(uid);
            })
            .catch((err)=>console.info(err));
        //**********
    }
    redirect(){
        this.$location.url('plugins/dreamcorp-app/page/import-bayesian-network'); //redirecting to importNet
    }
}
Control.templateUrl = 'components/control.html';