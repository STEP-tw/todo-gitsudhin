let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let WebApp = require('../webapp.js');
let app = require('../custom_handlers/handler.js');
let th = require('./testHelper.js');

describe('handlerModules',()=>{
  describe('getContentType function returns contentType according to the extension',()=>{
    it('should return contentType as text/html',()=>{
      assert.equal(app.getContentType('.html'),'text/html');
    })
    it('should return contentType as text/js',()=>{
      assert.equal(app.getContentType('.js'),'text/js');
    })
    it('should return contentType as image/jpg',()=>{
      assert.equal(app.getContentType('.jpg'),'image/jpg');
    })
    it('should return contentType as application/pdf',()=>{
      assert.equal(app.getContentType('.pdf'),'application/pdf');
    })
  })
  describe('setContentType function returns contentType according to the extension',()=>{
    let headers={};
    let res={setHeader:(type,contentType)=>{headers[type]=contentType}}

    it('should return contentType as text/html',()=>{
      app.setContentType('index.html',res);
      assert.deepEqual(headers,{'content-type':'text/html'});
    })
    it('should return contentType as text/js',()=>{
      app.setContentType('app.js',res);
      assert.deepEqual(headers,{'content-type':'text/js'});
    })
    it('should return contentType as image/jpg',()=>{
      app.setContentType('flower.jpg',res);
      assert.deepEqual(headers,{'content-type':'image/jpg'});
    })
    it('should return contentType as application/pdf',()=>{
      app.setContentType('result.pdf',res);
      assert.deepEqual(headers,{'content-type':'application/pdf'});
    })
    it('should return contentType as text/css',()=>{
      app.setContentType('style.css',res);
      assert.deepEqual(headers,{'content-type':'text/css'});
    })
  })
  describe('loadUser function should load registered user to req.user',()=>{
    it('should add user object to req.user if sessionid,username and pwd matches',()=>{
      let req={'cookies':{'sessionid':123}};
      let regUsers=[{'userName':'sudhin','name':'Sudhin','pwd':'123','sessionid':123}];
      let expected={'userName':'sudhin','name':'Sudhin','pwd':'123','sessionid':123};
      app.loadUser(req,res={},regUsers);
      assert.deepEqual(req.user,expected);
    })
    it('shouldnot add user object to req.user if sessionid not matches',()=>{
      let req={'cookies':{'sessionid':0}};
      let regUsers=[{'userName':'sudhin','name':'Sudhin','pwd':'123','sessionid':123}];
      app.loadUser(req,res={},regUsers);
      assert.deepEqual(req.user,undefined);
    })
  })
})
