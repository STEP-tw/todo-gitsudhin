let assert=require('chai').assert;
let Todo=require('../models/todo.js');

describe('Todo',()=>{
  beforeEach(()=>{
    todo = new Todo('Title','detail');
  })
  describe('1.getTitle',()=>{
    it('getTitle should give title of the todo',()=>{
      assert.equal(todo.getTitle(),'Title');
    })
  })
  describe('2.addItem',()=>{
    it('addItem should add new item to todoList',()=>{
      todo.addItem('Buy milk');
      let expected=[{text:'Buy milk',_isDone:false}];
      assert.deepEqual(todo.getAllItems(),expected);
    })
  })
  describe('3.getItem',()=>{
    it('getItem should give item of given id',()=>{
      todo.addItem('Buy milk');
      todo.addItem('Buy bottle');
      let expected={text:'Buy milk',_isDone:false};
      assert.deepEqual(todo.getItem(0),expected);
    })
    it('getItem should give empty object if id does not exist',()=>{
      todo.addItem('Buy milk');
      todo.addItem('Buy bottle');
      let expected={};
      assert.deepEqual(todo.getItem(2),expected);
    })
  })
  describe('4.getAllItem',()=>{
    it('getAllItems should give whole list of items it have',()=>{
      todo.addItem('Buy milk');
      todo.addItem('Buy bottle');
      let expected=[{text:'Buy milk',_isDone:false},{text:'Buy bottle',_isDone:false}];
      assert.deepEqual(todo.getAllItems(),expected);
    })
    it('getAllItems should give empty list if there is no item',()=>{
      let expected=[];
      assert.deepEqual(todo.getAllItems(),expected);
    })
  })
  describe('5.deleteItem',()=>{
    it('deleteItem should delete an item matches the input text',()=>{
      todo.addItem('Buy milk');
      todo.addItem('Buy bottle');
      todo.deleteItem(1);

      let expected=[{text:'Buy milk',_isDone:false}];
      assert.deepEqual(todo.getAllItems(),expected);
    })
    it('deleteItem should not delete any item if no match is found',()=>{
      todo.addItem('Buy milk');
      todo.addItem('Buy bottle');
      todo.deleteItem(3);

      let expected=[{text:'Buy milk',_isDone:false},{text:'Buy bottle',_isDone:false}];
      assert.deepEqual(todo.getAllItems(),expected);
    })
  })
  describe('6.markAnItemDone',()=>{
    it('markAnItemDone should mark checked status as true',()=>{
      todo.addItem('Buy milk');
      todo.markAnItemDone(0);
      let expected={text:'Buy milk',_isDone:true};
      assert.deepEqual(todo.getItem(0),expected);
    })
  })
  describe('7.markAnItemNotDone',()=>{
    it('markAnItemNotDone should mark checked status as false',()=>{
      todo.addItem('Buy milk');
      todo.markAnItemDone(0);
      todo.markAnItemNotDone(0);
      let expected={text:'Buy milk',_isDone:false};
      assert.deepEqual(todo.getItem(0),expected);
    })
  })
  describe('8.markTodoAsDone',()=>{
    it('markTodoAsDone should mark checked status as true',()=>{
      todo.markTodoAsDone();
      assert.ok(todo.isTodoDone());
    })
  })
  describe('9.markTodoAsNotDone',()=>{
    it('markTodoAsNotDone should mark checked status as false',()=>{
      todo.markTodoAsNotDone();
      assert.notOk(todo.isTodoDone());
    })
  })
  describe('10.isTodoDone',()=>{
    it('isTodoDone should give false if todo is not marked as done',()=>{
      assert.notOk(todo.isTodoDone());
    })
    it('isTodoDone should give true if todo is marked as done',()=>{
      todo.markTodoAsDone();
      assert.ok(todo.isTodoDone());
    })
  })
  describe('11.getDescription',()=>{
    it('getDescription should give description text of todo',()=>{
      let expected='detail';
      assert.equal(todo.getDescription(),expected);
    })
  })
  describe('12.editTitle',()=>{
    it('editTitle should change title of todo',()=>{
      todo.editTitle("changed title");
      assert.equal(todo.getTitle(),"changed title");
    })
    it('editTitle should change title if text is empty',()=>{
      todo.editTitle("");
      assert.equal(todo.getTitle(),"Title");
    })
  })
  describe('13.editDescription',()=>{
    it('editDescription should change description of todo',()=>{
      todo.editDescription("changed description");
      assert.equal(todo.getDescription(),"changed description");
    })
  })
  describe('14.editAnItem',()=>{
    beforeEach(()=>{
      todo.addItem('Buy milk');
      todo.editAnItem(0,"dont buy");
    })

    it('editAnItem should change text of item',()=>{
      let expected={text:"dont buy",_isDone:false};
      assert.deepEqual(todo.getItem(0),expected);
    })
    it('editAnItem should delete old text after editing',()=>{
      assert.deepEqual(todo.getItem(1),{});
    })
  })
  describe('15.checkItemStatus',()=>{
    beforeEach(()=>{
      todo.addItem('Buy milk');
      todo.editAnItem(0,"dont buy");
    })

    it('should return false initially',()=>{
      assert.notOk(todo.checkItemStatus(0));
    })
    it('should return true if status is changed',()=>{
      todo.markAnItemDone(0);
      assert.ok(todo.checkItemStatus(0));
    })
  })
})
