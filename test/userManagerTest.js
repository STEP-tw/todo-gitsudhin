let assert=require('chai').assert;
let UserManager=require('../models/userManager.js');
let userHandler;
describe('UserManager',()=>{
  beforeEach(()=>{
    userHandler = new UserManager();
  })
  describe('addUser',()=>{
    it('should create user and store it in an user list',()=>{
      userHandler.addUser('sudhin','123');
      assert.equal(userHandler.users.length,1);
    })
  })
  describe('getUser',()=>{
    it('should give user',()=>{
      userHandler.addUser('sudhin','123');
      let input=userHandler.getUser('sudhin');
      let expected={
        "name": "sudhin",
        "todoList": [],
        "sessionid" :"123"};
      assert.deepEqual(input,expected);
    })
  })
  describe('removeUser',()=>{
    it('should remove user from user list',()=>{
      userHandler.addUser('sudhin','123');
      userHandler.removeUser('sudhin');
      assert.equal(userHandler.users.length,0);
    })
  })

})
