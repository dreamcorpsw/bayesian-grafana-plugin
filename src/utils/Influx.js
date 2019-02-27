import * as $ from 'jquery';
class Influx{
    constructor(host,database){
        if(host!==null)
            this.host = host;
        else console.info("null host");
        if(database!==null)
            this.database = database;
        else console.info("null database");
    }
    
    //create a db in the host
    async createDB(){
        let query = 'q=CREATE DATABASE '+this.database;
        return $.ajax({
            url:this.host+'/query?',
            type:'GET',
            contentType:'application/octet-stream',
            data: query,
            processData: false,
            success: function (data) {
                console.info(data);
            },
            error: function(test, status, exception) {
                console.log("Error: " + exception);
            }
        });
    }
    
    async insertSingleMeasure(measurement,series,values){
        let query = measurement+',';
        for(let i = 0;i<series.length;i++){
            query+=series[i]+'='+values[i];
            if(i<series.length-2)
                query+=',';
            else query+=' ';
        }
        console.info("QUERY: "+query);
        return $.ajax({
            url:this.host+'/write?db='+this.database,
            type:'POST',
            contentType:'application/octet-stream',
            data: query,
            processData: false,
            error: function(test, status, exception) {
                console.log("Error: " + exception);
            }
        });
    }
    
    async insert(measurements,series,values){ //measurements = nodi, series = stati, values = probability
        const promises = [];
        for(let i=0;i<measurements.length;i++){
            promises.push(this.insertSingleMeasure(measurements[i],series[i],values[i]))
        }
        return Promise.all(promises); //synchronization
    }
    
    //da rivedere il ritorno di questa funzione
    async retrive(nodes){
        let query='q=SELECT * FROM';
        for(let i=0;i<nodes.length;i++){
            query += nodes[i]; //select from multiple measurements
            if(i<nodes.length-1) //solo fino al penultimo aggiungo la virgola
                query+=',';
        }
        console.info("QUERY: "+query);
        return $.ajax({
            url:this.host+'/query?db='+this.database,
            type:'GET',
            contentType:'application/octet-stream',
            data: query,
            processData: false,
            success: function (data) {
                console.info(data);
            },
            error: function(test, status, exception) {
                console.log("Error: " + exception);
            }
        });
    }
    
}
module.exports=Influx;
