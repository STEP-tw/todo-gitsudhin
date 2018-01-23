let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let WebApp = require('../webapp.js');
let handler = require('../custom_handlers/handler.js');
let th = require('./testHelper.js');

describe('handlerModules',()=>{
  describe('loadUser function should load registered user to req.user',()=>{
    it('should add user object to req.user if sessionid,username and pwd matches',()=>{
      let req={'cookies':{'sessionid':123}};
      let regUsers=[{'userName':'sudhin','name':'Sudhin','pwd':'123','sessionid':123}];
      let expected={'userName':'sudhin','name':'Sudhin','pwd':'123','sessionid':123};
      handler.loadUser(req,res={},regUsers);
      assert.deepEqual(req.user,expected);
    })
    it('shouldnot add user object to req.user if sessionid not matches',()=>{
      let req={'cookies':{'sessionid':0}};
      let regUsers=[{'userName':'sudhin','name':'Sudhin','pwd':'123','sessionid':123}];
      handler.loadUser(req,res={},regUsers);
      assert.deepEqual(req.user,undefined);
    })
  })
  describe('logoutUser',()=>{
    it('should delete the user session',()=>{
      request(handler.logoutUser,{method:'GET',url:'/logout',user:{userName:'sudhin'}},res=>{
        th.should_be_redirected_to(res,'/login.html');
      })
    })
  })
  describe('viewTodos',()=>{
    it('should show todo titles',()=>{
      request(handler.viewTodos,{method:'GET',url:'/viewTodo',user:{userName:'sudhin'}},res=>{
        th.body_contains(res,'');
      })
    })
  })
})
