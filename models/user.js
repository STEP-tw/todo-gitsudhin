const Todo=require('./todo.js');
class User{
  constructor(name,pwd,sessionid){
    this.userName=name;
    this.password=pwd;
    this.todoList=[];
  }
  hasSameUsernameAndPwd(userName,pwd){
    return this.userName==userName && this.password==pwd;
  }
  addTodo(title,description,items){
    let newTodo=new Todo(title,description);
    return newTodo.addItems(items);
  }
  getAllTodo(){
    return this.todoList;
  }
  findATodo(todoTitle){
    let todo=this.todoList.find((todo)=>{return todo.title==todoTitle});
    return todo;
  }
  deleteATodo(todoTitle){
    let todo=this.findATodo(todoTitle);
    let index=this.todoList.findIndex((todo)=>{ return todo.title==todoTitle });
    this.todoList.splice(index,1);
  }
  markATodoDone(todoTitle){
    let todo=this.findATodo(todoTitle);
    return todo.markTodoAsDone();
  }
  markATodoNotDone(todoTitle){
    let todo=this.findATodo(todoTitle);
    return todo.markTodoAsNotDone();
  }
}
module.exports=User;
