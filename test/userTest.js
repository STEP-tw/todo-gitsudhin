let assert=require('chai').assert;
let User=require('../models/user.js');

describe('User',()=>{
  beforeEach(()=>{
    user = new User('sudhin');
  })
  describe('1.getTodoOf',()=>{
    it('Should give a todo with given id',()=>{
      user.addTodo('sampleTodo1','sample');
      let input=user.getTodoOf(0);
      let expected={
        "checked": false,
        "description": "sample",
        "title": "sampleTodo1",
        "todoItems":[]};
      assert.deepEqual(input,expected);
    })
    it('Should give an empty object if id is invalid',()=>{
      user.addTodo('sampleTodo1','sample');
      let input=user.getTodoOf(1);
      let expected={};
      assert.deepEqual(input,expected);
    })
  })
  describe('2.addTodo',()=>{
    it('Should add todo',()=>{
      user.addTodo('sampleTodo','sample');
      let expected=['sampleTodo'];
      assert.deepEqual(user.getTodoTitles(),expected);
    })
    it('Should not add todo if title is empty',()=>{
      user.addTodo('','sample');
      let expected=['sampleTodo'];
      assert.notDeepEqual(user.getTodoTitles(),expected);
    })
  })
  describe('3.addTodoItem',()=>{
    beforeEach(()=>{
      user.addTodo('sample','detail');
    })
    it('Should add item to given todo',()=>{
      user.addTodoItem(0,'item');
      let expected=[ {"_isDone": false,"text": "item"}];
      let input=user.getTodoItemsOf(0);
      assert.deepEqual(input,expected);
    })
    it('Should not add item if todo does not exist',()=>{
      user.addTodoItem(2,'item');
      let expected=[ {"_isDone": false,"text": "item"}];
      let input=user.getTodoItemsOf(2);
      assert.notDeepEqual(input,expected);
    })
    it('Should not add item if it is empty string',()=>{
      user.addTodoItem(0,'');
      let input=user.getTodoItemsOf(0);
      let expected=[];
      assert.deepEqual(input,expected);
    })
  })
  describe('4.editTodoTitleOf',()=>{
    it('Should change the title of a todo',()=>{
      user.addTodo('sampleTodo','sample');
      user.editTodoTitleOf(0,'new sampleTodo');
      let expected=['new sampleTodo'];
      assert.deepEqual(user.getTodoTitles(),expected);
    })
    it('Should not do anything if todo does not exist',()=>{
      user.editTodoTitleOf(1,'new sampleTodo');
      let expected=[];
      assert.deepEqual(user.getTodoTitles(),[]);
    })
    it('Should not do anything if todo title is empty string',()=>{
      user.addTodo('sampleTodo','sample');
      user.editTodoTitleOf(0,'');
      let expected=[];
      assert.deepEqual(user.getTodoTitles(),['sampleTodo']);
    })
  })
  describe('5.getAllTodos',()=>{
    it('Should give a list of todos',()=>{
      user.addTodo('sampleTodo','sample');
      let input=user.getAllTodos();
      let expected=[{
        "checked": false,
        "description": "sample",
        "title": "sampleTodo",
        "todoItems":[]}];
      assert.deepEqual(input,expected);
    })
    it('Should give an emptylist if there is no todo',()=>{
      let input=user.getAllTodos();
      let expected=[];
      assert.deepEqual(input,expected);
    })
  })
  describe('6.getTodoItemsOf',()=>{
    it('Should give a list of todos',()=>{
      user.addTodo('sampleTodo','sample');
      user.addTodoItem(0,'firstItem');
      user.addTodoItem(0,'secondItem');
      let input=user.getTodoItemsOf(0);
      let expected=[ {"_isDone": false,"text": "firstItem"},{"_isDone": false,"text": "secondItem"}];
      assert.deepEqual(input,expected);
    })
    it('Should give an empty list if there is no item',()=>{
      user.addTodo('sampleTodo','sample');
      let input=user.getTodoItemsOf(0);
      let expected=[];
      assert.deepEqual(input,expected);
    })
  })
  describe('7.getTodoTitles',()=>{
    it('Should give a list of todo titles',()=>{
      user.addTodo('sampleTodo1','sample');
      user.addTodo('sampleTodo2','sample');
      let input=user.getTodoTitles();
      let expected=['sampleTodo1','sampleTodo2'];
      assert.deepEqual(input,expected);
    })
    it('Should give an empty list if there is no todo',()=>{
      let input=user.getTodoTitles();
      let expected=[];
      assert.deepEqual(input,expected);
    })
  })
  describe('8.findATodo',()=>{
    it('Should give a todo having same title as input',()=>{
      user.addTodo('sampleTodo1','sample');
      user.addTodo('sampleTodo2','sample');
      let input=user.findATodo('sampleTodo1');
      let expected={
        "checked": false,
        "description": "sample",
        "title": "sampleTodo1",
        "todoItems":[]};
      assert.deepEqual(input,expected);
    })
  })
  describe('9.deleteATodo',()=>{
    it('Should delete a todo',()=>{
      user.addTodo('sampleTodo1','sample');
      user.addTodo('sampleTodo2','sample');
      user.deleteATodo(1);
      let input=user.getTodoTitles();
      let expected=['sampleTodo1'];
      assert.deepEqual(input,expected);
    })
  })
  describe('10.markATodoDone',()=>{
    it('Should tick todo as done',()=>{
      user.addTodo('sampleTodo1','sample');
      user.markATodoDone(0);
      assert.ok(user.isTodoTicked(0));
    })
  })
  describe('11.markATodoNotDone',()=>{
    it('Should untick todo',()=>{
      user.addTodo('sampleTodo1','sample');
      user.markATodoNotDone(0);
      assert.notOk(user.isTodoTicked(0));
    })
  })
  describe('12.isTodoTicked',()=>{
    it('Should tell todo is ticked or not',()=>{
      user.addTodo('sampleTodo1','sample');
      assert.notOk(user.isTodoTicked(0));
      user.markATodoDone(0);
      user.isTodoTicked(0);
      assert.ok(user.isTodoTicked(0));
    })
  })
  describe('13.deleteTodoItemOf',()=>{
    it('Should delete a todo item with same id',()=>{
      user.addTodo('sampleTodo1','sample');
      user.addTodoItem(0,'firstItem');
      user.addTodoItem(0,'secondItem');
      user.deleteTodoItemOf(0,0);
      let input=user.getTodoItemsOf(0);
      let expected=[{"_isDone": false,"text": "secondItem"}];
      assert.deepEqual(input,expected);
    })
  })
  describe('14.editTodoDescriptionOf',()=>{
    it('Should change description of a todo with same id',()=>{
      user.addTodo('sampleTodo1','sample');
      user.editTodoDescriptionOf(0,'newSample');
      let input=user.getTodoOf(0);
      let expected={
        "checked": false,
        "description": "newSample",
        "title": "sampleTodo1",
        "todoItems":[]};
      assert.deepEqual(input,expected);
    })
  })
  describe('15.markTodoItemAsNotDone',()=>{
    it('Should untick todo item',()=>{
      user.addTodo('sampleTodo1','sample');
      user.addTodoItem(0,'sampleItem');
      user.markTodoItemAsNotDone(0,0);
      assert.notOk(user.isTodoTicked(0));
    })
  })
  describe('16.markTodoItemAsDone',()=>{
    it('Should tick todo item',()=>{
      user.addTodo('sampleTodo1','sample');
      user.addTodoItem(0,'sampleItem');
      user.markTodoItemAsDone(0,0);
      assert.ok(user.isItemTicked(0,0));
    })
  })
})
