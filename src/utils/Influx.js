import * as $ from 'jquery';
const DatabaseConnection = require('./DatabaseConnection');
class Influx extends  DatabaseConnection{
    //need for host,port and database
    constructor(host,port,database){
        super(host,port,database);
        console.info("New Influx");
    }
    //create a db in the host
    async createDB(){
        let query = 'q=CREATE DATABASE '+this.database;
        return $.ajax({
            url:this.host+this.port+'/query?',
            type:'GET',
            contentType:'application/octet-stream',
            data: query,
            processData: false,
            success: function (data) {
                console.info(data);
                console.info("database created");
            },
            error: function(test, status, exception) {
                console.log("Error: " + exception);
            }
        });
    }
    //insert into a single measurement
    async insertSingle(measurement,series,values){
        let query = measurement+',';
        for(let i = 0;i<series.length;i++){
            query+=series[i]+'='+values[i];
            if(i<series.length-2)
                query+=',';
            else query+=' ';
        }
        //console.info("QUERY: "+query);
        //console.info("URL: "+this.host+this.port+'/write?db='+this.database);
        return $.ajax({
            url:this.host+this.port+'/write?db='+this.database,
            type:'POST',
            contentType:'application/octet-stream',
            data: query,
            processData: false,
            error: function(test, status, exception) {
                console.log("Error: " + exception);
            }
        });
    }
    //insert inside all the db
    async insert(measurements,series,values){ //measurements = nodi, series = stati, values = probability
        const promises = [];
        for(let i=0;i<measurements.length;i++){
            promises.push(this.insertSingle(measurements[i],series[i],values[i]))
        }
        return Promise.all(promises); //synchronization
    }
    
    //cancella il database
    async drop(){
        let query = 'q=DROP DATABASE '+this.database;
        return $.ajax({
            url:this.host+this.port+'/query?',
            type:'GET', //controllare
            contentType:'application/octet-stream',
            data: query,
            processData: false,
            success: function (data) {
                console.info(data);
                console.info("database dropped");
            },
            error: function(test, status, exception) {
                console.log("Error: " + exception);
            }
        });
    }
}
module.exports = Influx;
