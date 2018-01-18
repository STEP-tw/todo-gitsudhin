const TodoItem=require('./todoItem.js');
class Todo {
  constructor(title,description) {
    this.title=title;
    this.description=description;
    this.todoItems=[];
    this.checked=false;
  }
  getTitle(){
    return this.title;
  }
  addItems(item){
    let newItem=new TodoItem(item);
    this.todoItems.push(newItem);
  }
  markTodoAsDone(){
    this.checked=true;
  }
  markTodoAsNotDone(){
    this.checked=false;
  }
}
module.exports=Todo;
