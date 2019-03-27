class AlertData{
    constructor(){
        console.info("AlertData");
        this.backend = null;
        this.data = [];
    }
    addBackend(backend){
        this.backend = backend;
    }
    async getDataFromAlert(netIndex,nodeIndex,panelId){
        
        return await this.backend.get('/api/alerts/?panelId='+panelId)
            .then(res => {
                let tris = {
                    value: null,
                    node: null,
                    net: null
                };
                //not null, not empty, not null first, non empty first, not null evalData
                if(res !== null && res.length !== 0 && res[0] !== null && res[0].length !==0 && res[0].evalData !== null && res[0].evalData.evalMatches !== null && res[0].evalData.evalMatches.length !== 0 && res[0].evalData.evalMatches[0].value !== null) {
                    tris.value = res[0].evalData.evalMatches[0].value;
                    tris.node = nodeIndex;
                    tris.net = netIndex;
                }
                this.data.push(tris); //se fallisce inserisco il valore null
            })
            .catch(err => err.isHandled=true);
    }
    
    async getValueFromAlert(netIndex,nodeIndex,panelId){
        
        return await this.backend.get('/api/alerts/?panelId='+panelId)
            .then(res => {
                //not null, not empty, not null first, non empty first, not null evalData
                let value = null;
                if(res !== null && res.length !== 0 && res[0] !== null && res[0].length !==0 && res[0].evalData !== null && res[0].evalData.evalMatches !== null && res[0].evalData.evalMatches.length !== 0 && res[0].evalData.evalMatches[0].value !== null) {
                    value = res[0].evalData.evalMatches[0].value;
                }
                return value;
            })
            .catch(err => err.isHandled=true);
    }
    
    getDataFromAllAlerts(nets){
        //console.info("getDataFromAllAlerts");
        this.networks = nets;
        const promises = [];
        let panelId = null;
        let tris = {
          value: null,
          net: null,
          node: null
        };
        for(let i=0;i<this.networks.length;i++){ //per ogni rete
            if(this.networks[i].monitored) { //***********************+ si può rimuovere visto che il controllo avviene dentro loop in Looper.js
                for (let j = 0; j < this.networks[i].nodi.length; j++) { //per tutti i nodi
                    panelId = this.networks[i].nodi[j].panel;
                    if (panelId) //filtro per i nodi non monitorati
                        promises.push(this.getDataFromAlert(i, j, panelId)); //eseguo il check dell'alert solo per i panel associati
                    else {
                        tris.net = i;
                        tris.node = j;
                        this.data.push(tris); //inserisco un tris con solo valore nullo, ma rete e nodo presenti per poter fare la unobserve
                    }
                }
            }
        }
        Promise.all(promises)  //lock synchro
            .then(()=>{
                return this.data;
            });
    }
}
module.exports = new AlertData();