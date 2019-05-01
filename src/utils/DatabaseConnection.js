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
                else throw "Database null Error";
            }
            else throw "Port null Error";
        }
        else throw "Host null Error";
    }
}

module.exports = DatabaseConnection;