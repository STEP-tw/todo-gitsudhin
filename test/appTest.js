let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.TODO_STORE = "./testStore.json";
let WebApp = require('../server/webapp.js');
let app = require('../app/todoApp.js');
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
        th.should_be_redirected_to(res,'/login.html');
        done();
      })
    })
    it('redirects to login.html',done=>{
      request(app,{method:'GET',url:'/view.html'},(res)=>{
        th.should_be_redirected_to(res,'/login.html');
        done();
      })
    })
    it('redirects to login.html',done=>{
      request(app,{method:'GET',url:'/create.html'},(res)=>{
        th.should_be_redirected_to(res,'/login.html');
        done();
      })
    })
    it.skip('redirects to index.html',done=>{
      request(app,{method:'GET',url:'/',headers:{cookies:[loginfailed=true]}},(res)=>{
        th.should_be_redirected_to(res,'/index.html');
        done();
      })
    })
  })
  describe('GET /index.html',()=>{
    it('gives the login page if user not loggedin',done=>{
      request(app,{method:'GET',url:'/index.html'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        done();
      })
    })
    it('gives the home page if user loggedin',done=>{
      request(app,{method:'GET',url:'/index.html',user:{userName:'sudhin',name:'Sudhin MN',password:'123'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Create new todo list');
        done();
      })
    })
  })
  describe('GET /login.html',()=>{
    it('serves the login page',done=>{
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
    it('redirects to index.html for valid user',done=>{
      request(app,{method:'POST',url:'/login.html',body:'userName=sudhin&pwd=123'},res=>{
        th.should_be_redirected_to(res,'/index.html');
        done();
      })
    })
    it('redirects to login.html with message for invalid user',done=>{
      request(app,{method:'POST',url:'/login.html',body:'userName=sudhin&pwd=1212'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        done();
      })
    })
  })
  describe('GET /view',()=>{
    it('serves the view page if user logged in',done=>{
      request(app,{method:'GET',url:'/view.html',user:{userName:'sudhin',name:'Sudhin MN',password:'123'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'_Preview');
        done();
      })
    })
    it('serves login page if no user logged in',done=>{
      request(app,{method:'GET',url:'/view.html'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        done();
      })
    })
  })
  describe('GET /create',()=>{
    it('serves the create todo page',done=>{
      request(app,{method:'GET',url:'/create.html',user:{userName:'sudhin',name:'Sudhin MN',password:'123'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Create new todo');
        th.content_type_is(res,'text/html');
        done();
      })
    })
    it('Redirects to login page if  no user loggedin',done=>{
      request(app,{method:'GET',url:'/create.html'},res=>{
        th.should_be_redirected_to(res,'/login.html');
        done();
      })
    })
  })
  describe('POST /create',()=>{
    it('serves the create todo page',done=>{
      let options={method:'POST',url:'/create.html',user:{userName:'sudhin',name:'Sudhin MN',password:'123'},body:'title=newtodo&description=xxxx&item='};
      request(app,options,res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Create new todo');
        th.body_contains(res,'newtodo');
        done();
      })
    })
  })
})
