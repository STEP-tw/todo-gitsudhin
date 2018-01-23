let fs=require('fs');
const lib = require('./handlerUtilities.js');
const Users=require('../models/userManager.js');
let userManager=new Users();

let handlerModules={};
let reg_users=[{"userName":"sudhin","name":"Sudhin MN","password":"123"}];

handlerModules.logRequest = function(req,res){
  let text = ['------------------------------',
    `${req.method} ${req.url}`,
    `HEADERS=> ${lib.toStr(req.headers)}`,
    `COOKIES=> ${lib.toStr(req.cookies)}`,
    `BODY=> ${lib.toStr(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
}

handlerModules.loadUser = (req,res,regUsers=reg_users)=>{
  let sessionid = req.cookies.sessionid;
  let user = regUsers.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

handlerModules.validateUser=function(req,res){
  let user = lib.getUserData(req,reg_users=reg_users);
  if(!user) {
    res.setHeader('Set-Cookie',[`logInFailed=true; Max-Age=5`]);
    res.redirect('/login.html');
    return;
  }
  userManager.addUser(user.userName);
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/index.html');
};

handlerModules.logoutUser=function(req,res){
  res.setHeader('Set-Cookie',[`loginFailed=false; Max-Age=5`,`sessionid=0`]);
  delete req.user.sessionid;
  res.redirect('/login.html');
};

handlerModules.redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/','/login.html']) && req.user) res.redirect('/index.html');
}

handlerModules.redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/','/index.html','/create.html','/view.html','/edit.html','/logout']) && !req.user) res.redirect('/login.html');
}

handlerModules.createTodo=function (req,res) {
  let title=req.body.title;
  let description=req.body.description;
  let user=userManager.getUser(req.user.userName);
  let items=req.body.item;

  user.addTodo(title,description);
  let id=user.getTodoTitles().length-1;
  lib.addItems(user,id,items);
  res.redirect('/index.html');
}

handlerModules.viewTodos=function (req,res) {
  let user=userManager.getUser(req.user.userName);
  let titles=user.getTodoTitles();
  let titleLinks=lib.parseTitlesToHtml(titles);

  res.write(titleLinks);
  res.end();
}

handlerModules.previewTodo=function(req,res) {
  let user=userManager.getUser(req.user.userName);
  let index=req.body.todoId;
  let todo=user.getTodoOf(index);
  let parsedTodo=lib.parseTodoToHTML(index,todo);

  res.setHeader('Set-Cookie',[`currentTodoId=${index}`]);
  res.write(parsedTodo);
  res.end();
}

handlerModules.deleteTodo=function(req,res){
  let user=userManager.getUser(req.user.userName);
  let todoId=req.body.todoID;
  user.deleteATodo(todoId);

  let newTitles=user.getTodoTitles();
  let titleLinks=lib.parseTitlesToHtml(newTitles);
  res.write(titleLinks);
  res.end();
}

handlerModules.deleteItem=function (req,res) {
  let user=userManager.getUser(req.user.userName);
  let action=req.body.action;
  let todoId=req.body.id.split('_')[0];
  let itemId=req.body.id.split('_')[1];
  let text=req.body.text;
  let editedTodo=lib.removeItem(todoId,itemId,user);
  res.write(editedTodo);
  res.end();
}

handlerModules.saveEditedItem=function(req,res){
  let user=userManager.getUser(req.user.userName);
  let todoId=req.cookies.currentTodoId;
  let text=req.body.newText;
  let itemId=req.body.itemId.split('_')[1];
  user.editTodoItem(todoId,itemId,text);

  res.redirect('/view.html');
}

module.exports=handlerModules;
