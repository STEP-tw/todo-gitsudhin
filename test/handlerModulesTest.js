const request = require('supertest');
let chai = require('chai');
let assert = chai.assert;
// let request = require('./requestSimulator.js');
// let WebApp = require('../webapp.js');
let handler = require('../custom_handlers/handler.js');
let th = require('./testHelper.js');
describe('handlerModules',()=>{
  describe('loadUser function should load registered user to req.user',()=>{
    it('shouldnot add user object to req.user if sessionid not matches',()=>{
      let next=()=>{};
      let req={'cookies':{'sessionid':0}};
      let regUsers=[{'userName':'sudhin','name':'Sudhin','pwd':'123','sessionid':123}];
      handler.loadUser(req,res={},next);
      assert.deepEqual(req.user,undefined);
    })
  })
})
