let chai = require('chai');
let assert = chai.assert;
const lib = require('../custom_handlers/handlerUtilities.js');
describe('handlerUtilities',()=>{

  describe('toStr',()=>{
    it('should convert object to string',()=>{
      let inputObj={name:'sudhin'};
      let expected='{\n  "name": "sudhin"\n}';
      assert.equal(lib.toStr(inputObj),expected);
    })
  })

  describe('parseTitlesToHtml',()=>{
    it('should parse title of todos into html format',()=>{
      let todoTitles=['hello'];
      let expected='<input type=\'checkbox\' id=\'0\' onclick=check() >\n      <button id=0 onclick=viewTodo(id)>hello</button><p><button id=0 onclick=editTodo(id)>Edit</button><button id=0 onclick=deleteTodo(id)>Delete</button><br></p>';
      assert.equal(lib.parseTitlesToHtml(todoTitles),expected);
    })
  })

  describe('parseTodoToHTML',()=>{
    it('should parse todo without items into html format',()=>{
      let todo={
        "checked": false,
        "description": "sample",
        "title": "sampleTodo1",
        "todoItems":[]
      };
      let expected='<h2>sampleTodo1</h2><br><h3>sample</h3>';
      assert.equal(lib.parseTodoToHTML(0,todo),expected);
    })
    it('should parse todo with items into html format',()=>{
      let todo={
        "checked": false,
        "description": "sample",
        "title": "sampleTodo1",
        "todoItems":[{text:"hai",_isDone:false}] };
      let expected='<h2>sampleTodo1</h2><br><h3>sample</h3><div id=0_0><br><br><input type="checkbox" id=0_0>hai&nbsp <button id=0_0 onclick="editText(id)">Edit</button><button id=0_0 onclick="deleteItem(id)">Delete</button></div>';
      assert.equal(lib.parseTodoToHTML(0,todo),expected);
    })
  })

  describe('addItems',()=>{
    beforeEach(()=>{
      user={
        items:[],
        addTodoItem (id,items) {
          user.items.push({id,items});
        },
        getItems () {
          return user.items;
        }
      }
    })
    it('should add item if it is a string',()=>{
      let expected=[{id: 0,items: 'hello'}];
      lib.addItems(user,0,'hello');
      assert.deepEqual(user.getItems(),expected);
    })
    it('should add item if it is a list',()=>{
      let expected=[{'id':0,'items':'hello'},{'id':0,'items':'hi'}];
      lib.addItems(user,0,['hello','hi']);
      assert.deepEqual(user.getItems(),expected);
    })
  })

  describe('getUserData',()=>{
    beforeEach(()=>{
      reg_users=[{"userName":"sudhin","password":"123"}];
    })
    it("should give logged in user's data",()=>{
      let req={body:{userName:'sudhin',pwd:'123'}};
      let expected={userName: 'sudhin',password: '123'};
      assert.deepEqual(lib.getUserData(req,reg_users),expected);
    })
    it("should not give any data if data is incorrect",()=>{
      let req={body:{userName:'ketan',pwd:'123'}};
      let expected;
      assert.deepEqual(lib.getUserData(req,reg_users),expected);
    })
    it("should not give any data if body is empty",()=>{
      let req={body:{}};
      let expected;
      assert.deepEqual(lib.getUserData(req,reg_users),expected);
    })
  })

  describe('removeItem',()=>{
    beforeEach(()=>{
      user={
        todo:{todoItems:[]},
        addTodoItem (id,items) {
          user.todo.todoItems.push({id,items});
        },
        deleteTodoItemOf (id,itemId) {
          user.todo.todoItems.splice(itemId,1);
        },
        getTodoOf(todoId){
          return user.todo;
        },
        getItems () {
          return user.todo.todoItems;
        }
      }
    })
    it('should remove item from todo items list of user',()=>{
      lib.addItems(user,0,['hi','hello']);
      lib.removeItem(0,0,user);
      let expected=[{id:0,items:'hello'}];
      let input=user.getItems();
      assert.deepEqual(input,expected);
    })
  })
})
