let fs=require('fs');
const lib = require('./handlerUtilities.js');
const Users=require('../models/userManager.js');
let userManager=new Users();

let handlerModules={};

let reg_users=[{"userName":"sudhin","name":"Sudhin MN","password":"123"}];
const getRegUsers=function(){
  return reg_users;
}

handlerModules.logRequest = function(req,res,next){
  let text = [
    '------------------------------',
    `${req.method} ${req.url}`,
    `HEADERS=> ${lib.toStr(req.headers)}`,
    `COOKIES=> ${lib.toStr(req.cookies)}`,
    `BODY=> ${lib.toStr(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
  next();
}

handlerModules.loadUser = (req,res,next)=>{
  let sessionid = req.cookies.sessionid;
  let regUsers=getRegUsers();
  let user = regUsers.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
  next();
};

handlerModules.validateUser=function(req,res){
  let user = lib.getUserData(req,reg_users=reg_users);
  if(!user) {
    res.setHeader('Set-Cookie',[`logInFailed=true; Max-Age=5`]);
    res.redirect('/index.html');
    return;
  }
  let sessionid = this.sessionIdGenerator();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  userManager.addUser(user.userName,sessionid);
  res.redirect('/home.html');
};

handlerModules.logoutUser=function(req,res){
  res.setHeader('Set-Cookie',[`loginFailed=false; Max-Age=5`,`sessionid=0`]);
  delete req.user.sessionid;
  res.redirect('/index.html');
};

handlerModules.redirectLoggedInUserToHome = (req,res,next)=>{
  let urls=['/','/index.html'];
  if(urls.includes(req.url) && req.user) res.redirect('/home.html');
  next();
}

handlerModules.redirectLoggedOutUserToLogin = (req,res,next)=>{
  let urls=['/','/home.html','/create.html','/view.html','/edit.html','/logout'];
  if(urls.includes(req.url) && !req.user){
    res.redirect('/index.html');
  }
  next();
}

handlerModules.createTodo=function (req,res) {
  let title=req.body.title;
  let description=req.body.description;
  let user=userManager.getUser(req.user.userName);
  let items=req.body.item;
  user.addTodo(title,description);
  let id=user.getTodoTitles().length-1;
  lib.addItems(user,id,items);
  res.redirect('/home.html');
}

handlerModules.viewTodos=function (req,res) {
  let user=userManager.getUser(req.user.userName);
  let titles=user.getTodoTitles();
  let titleLinks=lib.parseTitlesToHtml(titles);
  res.send(titleLinks);
}

handlerModules.previewTodo=function(req,res) {
  let user=userManager.getUser(req.user.userName);
  let index=req.cookies.currentTodoId;
  let todo=user.getTodoOf(index);

  let parsedTodo=lib.parseTodoToHTML(index,todo);
  res.setHeader('Set-Cookie',[`currentTodoId=${index}`]);
  res.send(parsedTodo);
}

handlerModules.deleteTodo=function(req,res){
  let user=userManager.getUser(req.user.userName);
  let todoId=req.body.todoID;
  user.deleteATodo(todoId);

  let newTitles=user.getTodoTitles();
  let titleLinks=lib.parseTitlesToHtml(newTitles);
  res.send(titleLinks);
}

handlerModules.deleteItem=function (req,res) {
  let user=userManager.getUser(req.user.userName);
  let todoId=req.params.id.split('_')[0];
  let itemId=req.params.id.split('_')[1];

  let editedTodo=lib.removeItem(todoId,itemId,user);
  res.send(editedTodo);
}

handlerModules.saveEditedItem=function(req,res){
  let user=userManager.getUser(req.user.userName);
  let todoId=req.cookies.currentTodoId;
  let text=req.body.newText;
  let itemId=req.body.itemId.split('_')[1];

  user.editTodoItem(todoId,itemId,text);
  res.redirect('/view.html');
}

handlerModules.editTodo=function(req,res){
  let user=userManager.getUser(req.user.userName);
  let todoId=req.body.id;
  let todo=user.getTodoOf(todoId);
  let content=`<form method="post">
  <input type="text" value=${req.body.id} name="itemId" hidden>
  Title<br>
  <input type="text" name="title"><br>
  description<br>
  <input type="text" name="description"><br>
  <input type="submit" value="Save changes"></form>`;
  res.send(content);
}

module.exports=handlerModules;
