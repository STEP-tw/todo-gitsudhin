const User = require('./user.js');
class Users{
  constructor(){
    this.users=[];
  }
  addUser(username,pwd){
    let user=new User(username,pwd);
    this.users.push(user);
  }
  getAllUsers(){
    return this.users;
  }
  findAUser(username){
    let user=this.users.find((user)=>{return user.username==username});
    return user;
  }
  addTodoOfAUser(username,title,description,items){
    let user=this.findAUser(username);
    return user.addTodo(title,description,items);
  }
  getAllTodoOfAUser(username){
    let user=this.findAUser(username);
    return user.getAllTodo();
  }
  removeATodoOfAUser(username,todoTitle){
    let user=this.findAUser(username);
    return user.deleteATodo(todoTitle);
  }
  markATodoOfAUserDone(username,todoTitle){
    let user=findAUser(username);
    return user.markATodoDone(todoTitle)
  }
  markATodoOfAUserNotDone(username,todoTitle){
    let user=findAUser(username);
    return user.markATodoNotDone(todoTitle);
  }
}
module.exports=Users;
