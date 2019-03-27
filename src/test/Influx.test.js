var sinon = require('sinon');
const $ = require('jquery');
/*window.$ = {ajax: jest,genMockFunction()}*/
const Influx = require("../utils/Influx")

global.console = {
    warn: jest.fn(),
    log: jest.fn(),
    info: jest.fn()
}

console.info = jest.fn();

let undefinedInflux = new Influx(null,null,null)

describe("Created null Influx class", () => {

    it('Should call console.info("null host")', () => {
        expect(console.info).toHaveBeenCalledWith("null host")
    });
    it('Should call console.info("new Influx"', () => {
        expect(console.info).toHaveBeenCalledWith("new Influx");
    });
});

let query = 'q=CREATE DATABASE '+ undefinedInflux.database;

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




it('makes a GET request for todo items', function () {
    sinon.replace(jQuery, 'ajax', sinon.fake());
    undefinedInflux.createDB(42, sinon.fake());

    assert(jQuery.ajax.calledWithMatch({ url: '/todo/42/items' }));
});


