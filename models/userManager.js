const User = require('./user.js');
class UserManager{
  constructor(){
    this.users=[];
  }
  addUser(username){
    let user=new User(username);
    this.users.push(user);
  }
  getUser(username){
    let user=this.users.find((user)=>{return user.name==username});
    return user;
  }
  removeUser(username){
    let user=this.getUser(username);
    let index=this.users.indexOf(user);
    this.users.splice(index,1);
  }
}
module.exports=UserManager;
