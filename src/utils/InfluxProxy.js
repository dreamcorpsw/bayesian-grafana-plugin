import * as $ from "jquery";

const DatabaseConnection = require('./DatabaseConnection');
const Influx = require("./Influx");
class InfluxProxy extends  DatabaseConnection{
    //need for host,port and database
    constructor(host,port,database){
        super(host,port,database);
        this.influx = null;
    }
    //check connection
    async checkConnection(){
        const context = this;
        return $.ajax({
            url:context.host+context.port+'/ping?verbose=true',
            type:'HEAD',
            success: function () {
                //console.info("connection ok");
                if(context.influx === null){ //solo se non c'è già
                    context.influx = new Influx(context.host, context.port, context.database); //se va tutto bene costruisco un influx
                }
            },
            error: function(test, status, exception) {
                //console.info("connection failed");
                context.influx = null;
            }
        });
    }
    async createDB() {
        this.checkConnection()
            .then(()=>{
                if (this.influx !== null){
                    return this.influx.createDB();
                }
                else throw "Connection Error";
            })
            .catch((err)=>console.info(err));
    }
    async insert(measurements,series,values){ //measurements = nodi, series = stati, values = probability
        this.checkConnection()
            .then(()=>{
                if(this.influx !== null){
                    return this.influx.insert(measurements,series,values);
                }
                else throw "Connection Error";
            })
            .catch((err)=>console.info(err));
    }
    
    async drop(){
        this.checkConnection()
            .then(()=>{
                if(this.influx !== null)
                    return this.influx.drop();
                else throw "Connection Error";
            })
    }
}
module.exports = InfluxProxy;
