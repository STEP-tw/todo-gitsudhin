const TodoItem=require('./todoItem.js');
class Todo {
  constructor(title,description) {
    this.title=title;
    this.description=description;
    this.todoItems=[];
    this.checked=false;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  addItem(text) {
    let newItem=new TodoItem(text);
    this.todoItems.push(newItem);
  }

  getItem(id) {
    return this.todoItems[id] || {};
  }

  getAllItems(){
    return this.todoItems || [];
  }

  editTitle(text) {
    if (text.length>0) return this.title=text;
  }

  editDescription(text) {
    return this.description=text;
  }

  editAnItem(id,newText) {
    return this.todoItems[id].text=newText;
  }

  deleteItem(id) {
    return this.todoItems.splice(id,1);
  }

  markAnItemDone(id) {
    return this.todoItems[id].markAsDone();
  }

  markAnItemNotDone(id) {
    return this.todoItems[id].markAsNotDone();
  }

  checkItemStatus(id) {
    return this.todoItems[id].isDone();
  }

  markTodoAsDone() {
    return this.checked=true;
  }

  markTodoAsNotDone() {
    return this.checked=false;
  }

  isTodoDone(){
    return this.checked;
  }
}
module.exports=Todo;
