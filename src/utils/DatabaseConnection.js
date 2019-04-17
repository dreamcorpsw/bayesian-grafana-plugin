class DatabaseConnection{
    //need for host,port and database
    constructor(host,port,database){
        console.info("New DatabaseConnection");
        if(host!==null){
            this.host = host;
            if(port!==null) {
                this.port = port;
                if (database !== null)
                    this.database = database;
                else console.info("null database");
            }
            else console.info("null port");
        }
        else console.info("null host");
    }
}

module.exports = DatabaseConnection;