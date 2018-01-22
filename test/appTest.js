let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.TODO_STORE = "./testStore.json";
let WebApp = require('../webapp.js');
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
    it('redirects to index.html',done=>{
      request(app,{method:'GET',url:'/',user:{userName:'sudhin'}},(res)=>{
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
  describe('GET /viewTodo',()=>{
    it('serves the view page if user logged in',done=>{
      request(app,{method:'GET',url:'/view.html',user:{userName:'sudhin'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Your Todo s');
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
      request(app,{method:'GET',url:'/create.html',user:{userName:'sudhin'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Create new todo');
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
      let options={method:'POST',url:'/create.html',user:{userName:'sudhin'},body:'title=newtodos&description=xxxx&todoItems='};
      request(app,options,res=>{
        th.should_be_redirected_to(res,'/index.html');
        done();
      })
    })
  })
  describe('POST /preview',()=>{
    it('should show the todo on button click',done=>{
      let options={method:'POST',url:'/preview',user:{userName:'sudhin'},body:'todoId=0'};
      request(app,options,res=>{
        th.body_contains(res,'newtodos');
        done();
      })
    })
  })
  describe('POST /deleteTodo',()=>{
    it('should delete todo on button click',done=>{
      let options={method:'POST',url:'/deleteTodo',user:{userName:'sudhin'},body:'todoID=0'};
      request(app,options,res=>{
        th.status_is_ok(res);
        th.body_does_not_contain(res,'newtodos');
        done();
      })
    })
  })
})
