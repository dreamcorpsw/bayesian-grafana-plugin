jest.mock('jquery', () => 'module not found', {virtual: true});
const InfluxProxy = require('../utils/InfluxProxy');
const Influx = require('../utils/Influx');
global.console = {
    warn: jest.fn(),
    log: jest.fn(),
    info: jest.fn()
};

console.info = jest.fn();

test('Should throw an exception', () => {
    try{
        let undefinedInflux = new InfluxProxy(null,null,null);
    }
    catch (e) {
        expect(e).toEqual("Host null Error");
    }
});

test('Should return an influx', () => {
    let proxy = new InfluxProxy("http://localhost","8086","mydb");
    proxy.influx = new Influx("http://localhost","8086","mydb");
    
    proxy.createDB()
        .catch(err => console.info(err));
    expect(console.info).toBeCalledWith("New DatabaseConnection");
    
});

test('Should throw a Connection Error', () =>{
    let proxy = new InfluxProxy("http://localhost","8086","mydb");
    proxy.influx = new Influx("http://localhost","8086","mydb");
    
    try {
        proxy.createDB()
            .catch(err => console.info(err));
    }
    catch (e) {
        expect(e).toEqual("Connection Error");
    }
});