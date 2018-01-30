let assert=require('chai').assert;
let Item=require('../models/todoItem.js');
describe('Item',()=>{
  beforeEach(()=>{
    item = new Item("This is text");
  })
  describe('isDone',()=>{
    it('creating item should set isDone as false intially',()=>{
      assert.notOk(item.isDone());
    })
    it('isDone should give true after marking an item',()=>{
      item.markAsDone();
      assert.ok(item.isDone());
    })
  })
  describe('markAsDone',()=>{
    it('markAsDone should give true after marking an item',()=>{
      let expected=item.markAsDone();
      assert.ok(expected);
    })
    it('markAsDone should give true after marking marked item',()=>{
      item.markAsDone();
      item.markAsDone();
      assert.ok(item.isDone());
    })
  })
  describe('markAsNotDone',()=>{
    it('markAsNotDone should give false after unmarking an item',()=>{
      let expected=item.markAsNotDone();
      assert.notOk(expected);
    })
    it('markAsNotDone should give false after unmarking unmarked item',()=>{
      item.markAsNotDone();
      item.markAsNotDone();
      assert.notOk(item.isDone());
    })
  })
})
