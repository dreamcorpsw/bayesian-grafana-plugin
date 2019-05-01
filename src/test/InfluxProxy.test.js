const InfluxProxy = require('../utils/InfluxProxy');

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