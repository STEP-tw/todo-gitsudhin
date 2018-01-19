const Todo=require('./todo.js');
class User{
  constructor(name,pwd){
    this.userName=name;
    this.password=pwd;
    this.todoList=[];
  }
  hasSameUsernameAndPwd(userName,pwd) {
    return this.userName==userName && this.password==pwd;
  }
  addTodo(title,description) {
    let newTodo=new Todo(title,description);
    this.todoList.push(newTodo);
  }
  addTodoItem(id,item) {
    return this.todoList[id] && item.length>0 && this.todoList[id].addItem(item);
  }
  editTodoItem(id,item) {
    return this.todoList[id] && item.length>0 && this.todoList[id].addItem(item);
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
    return this.todoList.map(function (todo) {
      return todo.title;
    })
  }
  editTodoTitleOf(todoId,newTitle) {
    return this.todoList[todoId] && this.todoList[todoId].editTitle(newTitle);
  }
  editTodoDescriptionOf(todoId,description) {
    return this.todoList[todoId] && this.todoList[todoId].editDescription(description);
  }
  findATodo(todoTitle){
    let todo=this.todoList.find((todo)=>{return todo.title==todoTitle});
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
}
module.exports=User;
