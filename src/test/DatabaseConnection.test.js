const DatabaseConnection = require("../utils/DatabaseConnection");
global.console = {
    warn: jest.fn(),
    log: jest.fn(),
    info: jest.fn()
};
console.info = jest.fn();

let db;
test("DatabaseConnection constructor message", ()=>{
    db = new DatabaseConnection("http://localhost","8086","mydb");
    expect(console.info).toBeCalledWith("New DatabaseConnection");
});

test("Should return a database exception", ()=>{
    try{
        db = new DatabaseConnection("http://localhost","8086",null);
    }
    catch (e) {
        expect(e).toEqual("Database null Error");
    }
});

test("Should return a port exception", ()=>{
    try{
        db = new DatabaseConnection("http://localhost",null,"mydb");
    }
    catch (e) {
        expect(e).toEqual("Port null Error");
    }
});

test("Should return a host exception", ()=>{
    try{
        db = new DatabaseConnection(null,"8086","mydb");
    }
    catch (e) {
        expect(e).toEqual("Host null Error");
    }
});