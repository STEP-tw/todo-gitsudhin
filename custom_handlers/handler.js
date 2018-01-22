const Users=require('../models/userManager.js');
let userManager=new Users();
const fs = require('fs');

let handlerModules={};
module.exports=handlerModules;

let reg_users=[{"userName":"sudhin","name":"Sudhin MN","password":"123"}];

let toStr = obj=>JSON.stringify(obj,null,2);

handlerModules.logRequest = function(req,res){
  let text = ['------------------------------',
    `${req.method} ${req.url}`,
    `HEADERS=> ${toStr(req.headers)}`,
    `COOKIES=> ${toStr(req.cookies)}`,
    `BODY=> ${toStr(req.body)}`,''].join('\n');
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
  let user = getUserData(req);
  if(!user) {
    console.log('no user logged in');
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
  delete req.user.sessionid || {};
  res.redirect('/login.html');
};

handlerModules.redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/','/login.html']) && req.user) res.redirect('/index.html');
}

handlerModules.redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/','/index.html','/create.html','/view.html','/edit.html','/logout']) && !req.user) res.redirect('/login.html');
}

handlerModules.getContentType=function(extension){
  let contentType={
    '.html':'text/html',
    '.js':'text/js',
    '.css':'text/css',
    '.jpeg':'image/jpeg',
    '.jpg':'image/jpg',
    '.gif':'image/gif',
    '.pdf':'application/pdf',
  }
  return contentType[extension];
};

handlerModules.setContentType=function(fileUrl,res){
  let extension=fileUrl.slice(fileUrl.lastIndexOf('.'));
  let contentType=this.getContentType(extension);
  res.setHeader('content-type',contentType);
};

handlerModules.createTodo=function (req,res) {
  let title=req.body.title;
  let description=req.body.description;
  let user=userManager.getUser(req.user.userName);
  let items=req.body.item;
  user.addTodo(title,description);
  let id=user.getTodoTitles().length-1;
  addItems(user,id,items);
  res.redirect('/index.html');
}

handlerModules.viewTodos=function (req,res) {
  let user=userManager.getUser(req.user.userName);
  let titles=user.getTodoTitles();
  let titleLinks=parseTitlesToHtml(titles);

  res.write(titleLinks);
  res.end();
}

handlerModules.previewTodo=function(req,res) {
  let user=userManager.getUser(req.user.userName);
  let index=req.body.todoId;
  let todoList=user.getTodoOf(index);
  let parsedTodo=parseTodoToHTML(todoList);

  res.write(parsedTodo);
  res.end();
}

const parseTitlesToHtml=function(todoTitles){
  let content='';
  let id=0;
  todoTitles.forEach((title)=>{
    content+=`<input type='checkbox' id='${id}' onclick=check() >
    <button id=${id} onclick=viewTodo(id)>${title}</button>`;
    content+=`<p><button id=${id}>Edit</button>`;
    content+=`<button id=${id} onclick=deleteTodo(id)>Delete</button><br></p>`;
    id++;
  });
  return content;
}

const parseTodoToHTML=function(todo){
  let id=0;
  let content=`<h2>${todo.title}</h2><br><h3>${todo.description}</h3>`;
  todo.todoItems.forEach(function (item) {
    content+=`<br><br><input type="checkbox" id=${id}>${item.text}`;
    content+=`&nbsp <button id=${id}>Edit</button>`;
    content+=`<button id=${id}>Delete</button>`;
    id++;
  });
  return content;
}

const addItems=function(user,id,items){
  if (typeof items == 'string') {
    user.addTodoItem(id,items);
  }if (typeof items =='object') {
    items.forEach(function (item) {
      user.addTodoItem(id,item);
    });
  }
}

const getFileContent=function(fs,file){
  return fs.readFileSync(file,'utf8');
};

const getUserData=function(req,regUsers=reg_users){
  return regUsers.find(u=>u.userName==req.body.userName&&u.password==req.body.pwd);
};

const getDummyUser=function(){
  let dummyUser=`[
  {
    "userName": "sudhin",
    "password": "123",
    "todoList": [
      {
        "title": "Sample todo",
        "description": "for testing",
        "todoItems": [ { "item": "Tesing item 1","checked": false } ]
      }
    ]
  }]`;
  return dummyuser;
}

//
// const parseDeleteEditButton=function(req,todoRecordsList,todoTitle){
//   let todo=todoRecordsList.find(todo=>todo.title==todoTitle);
//   let parsedTodo=parseTodoToHTML(todo,req);
//   parsedTodo+=`<br><br><a href='/deleteTodo${todo.title}'><button name='delete${todo.title}'>Delete</button></a>`;
//   parsedTodo+=`<a href='/editTodo${todo.title}'><button name='edit${todo.title}'>Edit</button></a>`;
//   return parsedTodo;
// };
//
//
// const loadRegisteredUsers=function(fs){
//   if(!fs.existsSync('../data/registeredUsers.json')){
//     let regUsersList=JSON.parse(getFileContent(fs,'../data/registeredUsers.json'));
//   }else{
//     let regUsersList=JSON.parse(getDummyUser());
//   }
//   regUsersList.forEach((user)=>{
//     users.addUser(user.userName);
//   })
// };


//
// const isThisItemChecked=function(todoTitle){
//   let dbContent=JSON.parse(getFileContent(fs,'../data/todoRecords.json') || getDummyUser());
//   let todo=dbContent.find(todoDetail=>todoDetail.title==todoTitle);
//   return todo.checked
// };
//
// const parseTodoToHTML=function(todoObj,req){
//   let content=`<h2>${todoObj.title}</h2><br><h3>${todoObj.description}</h3>`;
//   todoObj.item.forEach((item)=>{
//     content+=`<br><br><input type="checkbox" id='_cbItem${item}'>${item}`;
//   });
//   return content;
// };
//
//
// handlerModules.serveStaticFiles=function(req,res){
//   let fileUrl=req.url=='/' ? '../public/login.html' : '../public'+req.url;
//   if(fs.existsSync(fileUrl)){
//     try{
//       let fileContent=fs.readFileSync(fileUrl);
//       handlerModules.setContentType(fileUrl,res);
//       res.write(fileContent);
//       res.end();
//     }catch(ex){}
//   }
// };
//
// handlerModules.markTodoStatus=function(req,res){
//   let dbContent=JSON.parse(getFileContent(fs,'../data/todoRecords.json') || getDummyUser());
//   if(req.url.startsWith('/markDone')){
//     let todoTitle=req.url.slice(9);
//     let todo=dbContent.find(todoDetail=>todoDetail.title==todoTitle);
//     todo.checked=true;
//     fs.writeFileSync('../data/todoRecords.json',JSON.stringify(dbContent,null,2));
//   }
//   if(req.url.startsWith('/markNotDone')){
//     let todoTitle=req.url.slice(12);
//     let todo=dbContent.find(todoDetail=>todoDetail.title==todoTitle);
//     todo.checked=false;
//     fs.writeFileSync('../data/todoRecords.json',JSON.stringify(dbContent,null,2));
//   }
// };
//
// handlerModules.getMultipleTodoViewPageContent=function(req,res){
//   let todoTitle=req.url.slice(9);
//   let todoRecordsList=JSON.parse(getFileContent(fs,'../data/todoRecords.json') || getDummyUser());
//   let pageContent=getFileContent(fs,'../public/view.html');
//   let multipleTodos=parseLinks(todoRecordsList,req);
//
//   let parsedTodo=parseDeleteEditButton(req,todoRecordsList,todoTitle);
//   pageContent=pageContent.replace('_Preview',parsedTodo);
//   pageContent=pageContent.replace('_Links',multipleTodos);
//   return pageContent
// }
//
// handlerModules.serveButtonActioninView=function(req,res){
//   let dbContent=JSON.parse(getFileContent(fs,'../data/todoRecords.json') || getDummyUser());
//   if(req.url.startsWith('/viewTodo')){
//
//     let pageContent=handlerModules.getMultipleTodoViewPageContent(req,res);
//     handlerModules.setContentType('../public/view.html',res);
//     res.write(pageContent);
//     res.end();
//   }
//   if(req.url.startsWith('/deleteTodo')){
//
//     let todoTitle=req.url.slice(11);
//     let content=dbContent.filter((todo)=>{return todo.title != todoTitle});
//
//     fs.writeFileSync('../data/todoRecords.json',JSON.stringify(content,null,2));
//     res.redirect('/view.html');
//   }
//   if(req.url.startsWith('/editTodo')&&req.method=='GET'){
//     let pageContent=getFileContent(fs,'../public/edit.html')
//     let todoTitle=req.url.slice(9);
//     let todo=dbContent.find(todoDetail=>todoDetail.title==todoTitle);
//
//     let items=todo.item.join(',');
//     items=items.replace(/,/gi,'\n');
//
//     let parsedForm=`<form class="todoDetails" method="POST">Title<br>`;
//     parsedForm+=`<input id="textbox" type="text" name=title value=${todo.title.replace(/\s/gi,'+')}><br>`;
//     parsedForm+=`Description<br><input id="textbox" type="text" name=description value=${todo.description.replace(/\s/gi,'+')}><br>`;
//     parsedForm+=`Items<br><textarea id="itemTextArea" name=item rows="10" cols="80">${items}</textarea><br>`;
//     parsedForm+=`<input type="submit"></form>`;
//
//     pageContent=pageContent.replace('_Element',parsedForm);
//     res.write(pageContent);
//     res.end();
//   }
//   if(req.url.startsWith('/editTodo')&&req.method=='POST'){
//
//     let todoTitle=req.url.slice(9);
//     let todo=dbContent.find(todoDetail=>todoDetail.title==todoTitle);
//
//     todo.title=req.body.title;
//     todo.description=req.body.description;
//     todo.item=req.body.item.split('\n');
//
//     fs.writeFileSync('../data/todoRecords.json',JSON.stringify(dbContent,null,2));
//     res.redirect('/view.html');
//   }
// }
//
//
// handlerModules.getViewPage=function(req,res){
//
  // let fileContent=getFileContent(fs,'../public/view.html');
  // let dbContent=JSON.parse(getFileContent(fs,'../data/todoRecords.json') || getDummyUser());

//   let multipleTodos=parseLinks(dbContent,req);
//   fileContent=fileContent.replace('_Links',multipleTodos);
//   fileContent=fileContent.replace('Hi User',` Hi ${req.user.userName}`);
//
//   handlerModules.setContentType('../public/view.html',res);
//   res.write(fileContent);
//   res.end();
// };
//
// handlerModules.getCreateTodoPage=function(req,res){
//   let fileContent=getFileContent(fs,'../public/create.html');
//   fileContent=fileContent.replace('Hi User',`Hi ${req.user.userName}`);
//   handlerModules.setContentType('../public/create.html',res);
//
//   res.write(fileContent);
//   res.end();
// };
//
// handlerModules.postTodoAction=function(req,res){
//
//   let dbContentList=JSON.parse(getFileContent(fs,'../data/todoRecords.json') || getDummyUser());
//
//   req.body.username=req.user.userName;
//   let itemsList=req.body['item'].split('\n');
//   req.body.item=itemsList;
//   dbContentList.push(req.body);
//   let filePath=process.env.TODO_STORE || '../data/todoRecords.json';
//   fs.writeFileSync(filePath,JSON.stringify(dbContentList,null,2));
//
//   let fileContent=getFileContent(fs,'../public/create.html');
//   let parsedTodo=parseTodoToHTML(req.body,req);
//
//   fileContent=fileContent.replace('_Preview',parsedTodo);
//   fileContent=fileContent.replace('Visible','hidden');
//   handlerModules.setContentType('../public/create.html',res);
//
//   res.write(fileContent);
//   res.end();
// };
