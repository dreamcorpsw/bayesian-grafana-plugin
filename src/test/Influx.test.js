jest.mock('jquery', () => 'module not found', {virtual: true});
const Influx = require("../utils/Influx");

global.console = {
    warn: jest.fn(),
    log: jest.fn(),
    info: jest.fn()
};

console.info = jest.fn();


test('Should throw an exception', () => {
    try{
        let undefinedInflux = new Influx(null,null,null);
    }
    catch (e) {
        expect(e).toEqual("Host null Error");
    }

});



test ('Called function createDB', ()=>{
    let db = new Influx("http://localhost","8086","mydb");
    db.createDB().catch((err)=>console.log(err));

    //afterEach(() => expect(ajax).toBeCalled())
});

test ('Called function insertSingle', ()=>{
    let db = new Influx("http://localhost","8086","mydb");
    db.insertSingle(1,2,1).catch((err)=>console.log(err));

    //afterEach(() => expect(ajax).toBeCalled())
});

test ('Called function insert', ()=>{
    let db = new Influx("http://localhost","8086","mydb");
    db.insert(1,2,1).catch((err)=>console.log(err));

    //afterEach(() => expect(ajax).toBeCalled())
});

test ('Called function drop', ()=>{
    let db = new Influx("http://localhost","8086","mydb");
    db.drop().catch((err)=>console.log(err));

    //afterEach(() => expect(ajax).toBeCalled())
});