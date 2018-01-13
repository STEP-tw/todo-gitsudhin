let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let WebApp = require('../server/webapp.js');
let app = require('../todoApp.js');
let th = require('./testHelper.js');

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })
  describe('GET /',()=>{
    it('redirects to login.html',done=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        th.should_be_redirected_to(res,'login.html');
        assert.equal(res.body,"");
        done();
      })
    })
  })
  describe('GET /index.html',()=>{
    it('gives the login page',done=>{
      request(app,{method:'GET',url:'/index.html'},res=>{
        done();
      })
    })
  })
  describe('GET /login.html',()=>{
    it.skip('serves the login page',done=>{
      request(app,{method:'GET',url:'/login.html'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Username');
        th.body_does_not_contain(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })

  describe('POST /login',()=>{
    it.skip('redirects to index.html for valid user',done=>{
      request(app,{method:'POST',url:'/login.html',body:'userName=sudhin'},res=>{
        th.should_be_redirected_to(res,'/index.html');
        done();
      })
    })
    it('redirects to login.html with message for invalid user',done=>{
      request(app,{method:'POST',url:'/login.html',body:'userName=badUser'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        done();
      })
    })
  })
  describe.skip('GET /view',()=>{
    it('serves the view page',done=>{
      request(app,{method:'GET',url:'/view.html',body:'userName=sudhin'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Your Todo s');
        done();
      })
    })
  })
  describe('GET /create',()=>{
    it('serves the create todo page',done=>{
      request(app,{method:'GET',url:'/create.html'},res=>{

        done();
      })
    })
  })
  describe.skip('POST /create',()=>{
    it('serves the create todo page',done=>{
      request(app,{method:'POST',url:'/create.html',body:'userName=sudhin'},res=>{
        th.should_be_redirected_to(res,'/create.html');
        th.body_contains(res,'Create new todo');
        done();
      })
    })
  })
})


describe.skip('Testing parser functions',()=>{
  it('parseLink fn should return the html code for button link with title as name',done=>{
    let expected=`<ol><li><a href="/view.html"><button name="todo1">my todo</button></a></li></ol>`;

    request(app,{method:'GET',url:'view.html'},(res)=>{
      assert.equal(app.parseLink([{"username":'sudhin',"title":"my todo"}],request),expected);
    });
  })
})
