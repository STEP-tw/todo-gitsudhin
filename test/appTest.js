let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let WebApp = require('../server/webapp.js');
let app = require('../todoApp.js');
let th = require('./testHelper.js');

describe.skip('Testing parser functions',()=>{
  it('parseLink fn should return the html code for button link with title as name',done=>{
    let expected=`<ol><li><a href="/view.html"><button name="todo1">my todo</button></a></li></ol>`
    request(app,{method:'GET',url:'../public/view.html'},(res)=>{
      assert.deepEqual(app.parseLink([{"username":'sudhin',"title":"my todo"}],req),expected);
    });
  })
})
