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

//let query = 'q=CREATE DATABASE '+ undefinedInflux.database;

/*undefinedInflux.createDB().mockImplementation(
  cb  => {
      cb({
          url: undefinedInflux.host + '/query?',
          type: 'GET',
          contentType: 'application/octet-stream',
          data: query,
          processData: false,
      });
  })
*/







