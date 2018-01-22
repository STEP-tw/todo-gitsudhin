let assert=require('chai').assert;
let StaticFileHandler=require('../custom_handlers/static_file_handler.js');
let th = require('./testHelper.js');
let request = require('./requestSimulator.js');
let dummyFS={
  readFileSync:function(path){
    let content='fileContentReaded';
    return content;
  },
    existsSync:function(path){return path!='/public/dummyFile.txt'}
  }


describe('Static File Handler',()=>{
  beforeEach(()=>{
    fileHandler=new StaticFileHandler('/public',dummyFS);
  })
  describe('execute',()=>{
    it('should respond with 404 if file not exist',done=>{
      request(fileHandler.getRequestHandler(),{method:'GET',url:'dummyFile.txt'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
    it('should respond with 200 if file exist',done=>{
      request(fileHandler.getRequestHandler(),{method:'GET',url:'goodFile.txt'},(res)=>{
        th.body_contains(res,'fileContentReaded');
        done();
      })
    })
  })
})
