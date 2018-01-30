const request = require('supertest');
let chai = require('chai');
let assert = chai.assert;
process.env.TODO_STORE = "./testStore.json";
let app = require('../todoApp.js');
app.sessionIdGenerator=function(){
  return '1234';
}

let doesNotContain = (pattern)=>{
  return (res)=>{
    let match = res.text.match(pattern);
    if(match) throw new Error(`'${res.text}' contains '${pattern}'`);
  }
};

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app)
        .get('/bad')
        .expect(404)
        .end(done)
    })
  })
  describe('GET /',()=>{
    it('redirects to login page if not logged in',done=>{
      request(app)
        .get('/')
        .expect(302)
        .expect('Location','/index.html')
        .end(done)
    })
    it('redirects to login page if not logged in',done=>{
      request(app)
        .get('/view.html')
        .expect(302)
        .expect('Location','/index.html')
        .end(done)
    })
    it('redirects to login page if not logged in',done=>{
      request(app)
        .get('/create.html')
        .expect(302)
        .expect('Location','/index.html')
        .end(done)
    })
    it('redirects to home page if loggedin',done=>{
      request(app)
        .post('/login')
        .send('userName=sudhin&pwd=123')
        .expect(302)
        .expect('Location','/home.html')
        .end(done)
    })
  })
  describe('GET /home.html',()=>{
    it('gives the login page if user not loggedin',done=>{
      request(app)
        .get('/home.html')
        .expect(302)
        .expect('Location','/index.html')
        .end(done)
    })
    it('gives the home page if user loggedin',done=>{
      request(app)
        .post('/login')
        .send('userName=sudhin&pwd=123')
        .expect(302)
        .end(()=>{
          request(app)
          .get('/home.html')
          .set('cookie','sessionid=1234')
          .expect(200)
          .expect('Content-Type',/html/)
          .expect(/Create new todo list/)
          .end(done)
        })
    })
  })
  describe('GET /index.html',()=>{
    beforeEach
    it('serves the login page',done=>{
      //   th.should_not_have_cookie(res,'message');
      request(app)
        .get('/index.html')
        .expect(200)
        .expect('Content-Type',/html/)
        .expect(/Username/)
        .expect(doesNotContain(/login failed/))
        .end(done)
    })
  })

  describe('POST /login',()=>{
    it('redirects to home.html for valid user',done=>{
      request(app)
        .post('/login')
        .send('userName=sudhin&pwd=123')
        .expect(302)
        .expect('Location','/home.html')
        .end(done);
    })
    it('redirects to login page with message for invalid user',done=>{
      request(app)
        .post('/login')
        .send('userName=badUser&pwd=123')
        .expect(302)
        .expect('Location','/index.html')
        .end(done);
    })
  })
  describe('GET /viewTodo',()=>{
    it('serves the view page if user logged in',done=>{
      request(app)
        .post('/login')
        .send('userName=sudhin&pwd=123')
        .end(()=>{
          request(app)
          .get('/view.html')
          .set('cookie','sessionid=1234')
          .expect(200)
          .expect('Content-Type',/html/)
          .expect(/Your Todo s/)
          .end(done)
        })
    })
    it('serves login page if no user logged in',done=>{
      request(app)
        .get('/view.html')
        .expect(302)
        .expect('Location','/index.html')
        .end(done)
    })
  })
  describe('GET /create',()=>{
    it('serves the create todo page',done=>{
      request(app)
        .post('/login')
        .send('userName=sudhin&pwd=123')
        .end(()=>{
          request(app)
          .get('/create.html')
          .set('cookie','sessionid=1234')
          .expect(200)
          .expect('Content-Type',/html/)
          .expect(/Create new todo/)
          .end(done)
        })
    })
    it('Redirects to login page if  no user loggedin',done=>{
      request(app)
        .get('/create.html')
        .expect(302)
        .expect('Location','/index.html')
        .end(done)
    })
  })
  describe('POST /create',()=>{
    it('serves the create todo page',done=>{
      request(app)
        .post('/login')
        .send('userName=sudhin&pwd=123')
        .end(()=>{
          request(app)
          .post('/create.html')
          .send('title=newtodos&description=xxxx&todoItems=')
          .set('cookie','sessionid=1234')
          .expect(302)
          .expect('Location','/home.html')
          .end(done)
        })
    })
  })
  describe('POST /preview',()=>{
    it('should show the todo on button click',done=>{
      request(app)
        .post('/login')
        .send('userName=sudhin&pwd=123')
        .end(()=>{
          request(app)
          .post('/preview')
          .send('todoId=0')
          .set('cookie','sessionid=1234; currentTodoId=0')
          .expect(200)
          .expect(/newtodos/)
          .end(done)
        })
    })
  })
  describe('POST /deleteTodo',()=>{
    it('should delete todo on button click',done=>{
      request(app)
        .post('/login')
        .send('userName=sudhin&pwd=123')
        .end(()=>{
          request(app)
          .post('/deleteTodo')
          .send('todoId=0')
          .set('cookie','sessionid=1234; currentTodoId=0')
          .expect(200)
          .expect(doesNotContain(/todoTitle /))
          .end(done)
        })
    })
  })
})
