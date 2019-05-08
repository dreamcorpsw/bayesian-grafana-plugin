const Looper = require('../utils/Looper');
const DashboardLoader = require('../utils/DashboardLoader');
const InfluxProxy = require('../utils/InfluxProxy');
import {appEvents} from 'grafana/app/core/core';

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
                this.setDataFromNets();
                this.wait();
            });
    }
    
    wait(){
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
        let options = {
            overwrite : true
        };
        return this.backendSrv.saveDashboard(this.dashboards[index],options)
            .then(()=>{
                appEvents.emit('alert-success', ['Salvataggio della rete avvenuto correttamente', '']);
            })
            .catch((err)=>{
                appEvents.emit('alert-error', ['Impossibile salvare le modifiche alla rete',err]);
            });
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
        const uid = this.dashboards[index].uid;
        console.info({uid});
    
        //vediamo se esiste
        this.backendSrv
            .getDashboardByUid(uid)
            .then(dash => {
                console.info(dash.dashboard.network.id);
                
                //**********
                let influx = new InfluxProxy(this.networks[index].host,this.networks[index].port,this.networks[index].id);
                influx.drop()
                    .then(()=>{
                        this.networks.splice(index,1); //elimino dall'array
                        this.backendSrv.deleteDashboard(uid) //elimina la dashboard
                            .then(()=>{
                                this.deleteDatasource(dash.dashboard.network.id) //elimino la datasource
                                    .then(()=>{
                                        location.reload(); //refresh della pagina
                                    });
                            });
                    })
                    .catch((err)=>console.info(err));
                //**********
            })
            .catch(err => {
                appEvents.emit('alert-error', ['An error occurred', 'Try refreshing this page']);
                err.isHandled = true;
            });
        
    }
    
    deleteDatasource(id){
        return this.backendSrv.delete('/api/datasources/name/InfluxDB-'+id)
            .then((res)=>console.info(res))
            .catch((err)=>console.info(err));
    }
    
    redirect(){
        this.$location.url('plugins/dreamcorp-app/page/import-bayesian-network'); //redirecting to importNet
    }
}
Control.templateUrl = 'components/control.html';