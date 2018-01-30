const User = require('./user.js');
class UserManager{
  constructor(){
    this.users=[];
  }

  addUser(username,sessionid){
    let user=new User(username,sessionid);
    this.users.push(user);
  }

  getUser(username){
    let user=this.users.find((user)=>user.name==username);
    return user;
  }

  removeUser(username){
    let user=this.getUser(username);
    let index=this.users.indexOf(user);
    this.users.splice(index,1);
  }
}
module.exports=UserManager;
