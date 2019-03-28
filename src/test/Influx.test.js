const $ = require('jquery');
const Influx = require("../utils/Influx");

jest.mock('jquery');

global.console = {
    warn: jest.fn(),
    log: jest.fn(),
    info: jest.fn()
};

console.info = jest.fn();

let undefinedInflux = new Influx(null,null,null);

describe("Created null Influx class", () => {

    it('Should call console.info("null host")', () => {
        expect(console.info).toHaveBeenCalledWith("null host")
    });
    it('Should call console.info("new Influx"', () => {
        expect(console.info).toHaveBeenCalledWith("new Influx");
    });
});

//let query = 'q=CREATE DATABASE '+ undefinedInflux.database;


test("Called function createDB", ()=>{
    undefinedInflux.createDB().catch((err)=>console.log(err));

        afterEach(() => expect($.ajax()).toBeCalled()
        )
});