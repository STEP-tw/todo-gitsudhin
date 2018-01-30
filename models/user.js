const Todo=require('./todo.js');
class User{
  constructor(name,sessionid){
    this.name=name;
    this.sessionid=sessionid;
    this.todoList=[];
  }

  addTodo(title,description) {
    if (title.length>0) {
      let newTodo=new Todo(title,description);
      this.todoList.push(newTodo);
    }
  }

  addTodoItem(id,item) {
    return this.todoList[id] && item.length>0 && this.todoList[id].addItem(item);
  }

  editTodoItem(todoId,itemId,text) {
    return this.todoList[todoId] && this.todoList[todoId].editAnItem(itemId,text);
  }

  deleteTodoItemOf(todoId,itemId){
    return this.todoList[todoId] && this.todoList[todoId].deleteItem(itemId);
  }

  getTodoOf(todoId){
    return this.todoList[todoId] || {};
  }

  getAllTodos() {
    return this.todoList;
  }

  getTodoItemsOf(id) {
    return this.todoList[id] && this.todoList[id].getAllItems();
  }

  getTodoTitles() {
    return this.todoList.map((todo) => todo.title)
  }

  editTodoTitleOf(todoId,newTitle) {
    return this.todoList[todoId] && this.todoList[todoId].editTitle(newTitle);
  }

  editTodoDescriptionOf(todoId,description) {
    return this.todoList[todoId] && this.todoList[todoId].editDescription(description);
  }

  findATodo(todoTitle){
    let todo=this.todoList.find((todo)=>todo.title==todoTitle);
    return todo;
  }

  deleteATodo(id){
    this.todoList.splice(id,1);
  }

  markATodoDone(id){
    return this.todoList[id].markTodoAsDone();
  }

  markATodoNotDone(id){
    return this.todoList[id].markTodoAsNotDone();
  }

  isTodoTicked(id){
    return this.todoList[id].isTodoDone();
  }

  markTodoItemAsDone(todoId,id){
    return this.todoList[todoId].markAnItemDone(id);
  }

  markTodoItemAsNotDone(todoId,id){
    return this.todoList[todoId].markAnItemNotDone(id);
  }

  isItemTicked(todoId,id){
    return this.todoList[todoId].checkItemStatus(id);
  }
}
module.exports=User;
