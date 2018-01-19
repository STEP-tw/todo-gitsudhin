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
  getItem(text) {
    return this.todoItems.find((item)=>{return item.text==text}) || {};
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
  editAnItem(oldText,text) {
    let item=this.getItem(oldText);
    item.text=text;
  }
  deleteItem(text) {
    let item=this.getItem(text);
    let index=this.todoItems.indexOf(item);
    if (index>=0) this.todoItems.splice(index,1);
  }
  markAnItemDone(text) {
    let item=this.getItem(text);
    item._isDone=true;
  }
  markAnItemNotDone(text) {
    let item=this.getItem(text);
    item._isDone=false;
  }
  markTodoAsDone() {
    this.checked=true;
  }
  markTodoAsNotDone() {
    this.checked=false;
  }
  isTodoDone(){
    return this.checked;
  }
}
module.exports=Todo;
