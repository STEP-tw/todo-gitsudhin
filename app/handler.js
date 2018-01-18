const Users=require('../models/users.js');
let users=new Users();
const timeStamp = require('../server/time.js').timeStamp;
const fs = require('fs');

let handlerModules={};
module.exports=handlerModules;

let toStr = obj=>JSON.stringify(obj,null,2);

const loadRegisteredUsers=function(){
  let regUsersList=JSON.parse(getFileContent('../data/registeredUsers.json'));
  regUsersList.forEach((user)=>{
    users.addUser(user.userName,user.password);
  })
};

const parseDeleteEditButton=function(req,todoRecordsList,todoTitle){
  let todo=todoRecordsList.find(todo=>todo.title==todoTitle);
  let parsedTodo=parseTodoToHTML(todo,req);
  parsedTodo+=`<br><br><a href='/deleteTodo${todo.title}'><button name='delete${todo.title}'>Delete</button></a>`;
  parsedTodo+=`<a href='/editTodo${todo.title}'><button name='edit${todo.title}'>Edit</button></a>`;
  return parsedTodo;
};

const getFileContent=function(file,encoding='utf8'){
  return fs.readFileSync(file,encoding);
};

const parseLinks=function(dbContent,req){
  let todosOfThisUser=dbContent.filter((todo)=>{
    return todo.username==req.user.userName;
  });

  let content='';
  todosOfThisUser.forEach((todo)=>{
    if(isThisItemChecked(todo.title)){
      content+=`<input type='checkbox' id='_cb${todo.title}' checked onclick=check() ><a href='/viewTodo${todo.title}'><button id=_button${todo.title} onclick=previewTodo()>${todo.title}</button></a><br>`;
    }else{
      content+=`<input type='checkbox' id='_cb${todo.title}' onclick=check() ><a href='/viewTodo${todo.title}'><button id=_button${todo.title} onclick=previewTodo()>${todo.title}</button></a><br>`;
    }
  });
  return content;
};

const isThisItemChecked=function(todoTitle){
  let dbContent=JSON.parse(getFileContent('../data/todoRecords.json'));
  let todo=dbContent.find(todoDetail=>todoDetail.title==todoTitle);
  return todo.checked
};

const parseTodoToHTML=function(todoObj,req){
  let content=`<h2>${todoObj.title}</h2><br><h3>${todoObj.description}</h3>`;
  todoObj.item.forEach((item)=>{
    content+=`<br><br><input type="checkbox" id='_cbItem${item}'>${item}`;
  });
  return content;
};

const getUserData=function(req,regUsers=users.getAllUsers()){
  return regUsers.find(u=>u.userName==req.body.userName&&u.password==req.body.pwd);
};

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

handlerModules.logRequest = function(req,res){
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toStr(req.headers)}`,
    `COOKIES=> ${toStr(req.cookies)}`,
    `BODY=> ${toStr(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
}

handlerModules.loadUser = (req,res,regUsers=users.getAllUsers())=>{
  let sessionid = req.cookies.sessionid;
  let user = regUsers.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

handlerModules.serveStaticFiles=function(req,res){
  let fileUrl=req.url=='/' ? '../public/login.html' : '../public'+req.url;
  if(fs.existsSync(fileUrl)){
    try{
      let fileContent=getFileContent(fileUrl,null);
      handlerModules.setContentType(fileUrl,res);
      res.write(fileContent);
      res.end();
    }catch(ex){}
  }
};

handlerModules.markTodoStatus=function(req,res){
  let dbContent=JSON.parse(getFileContent('../data/todoRecords.json'));
  if(req.url.startsWith('/markDone')){
    let todoTitle=req.url.slice(9).replace(/%20/gi,' ');
    let todo=dbContent.find(todoDetail=>todoDetail.title==todoTitle);
    todo.checked=true;
    fs.writeFileSync('../data/todoRecords.json',JSON.stringify(dbContent,null,2));
  }
  if(req.url.startsWith('/markNotDone')){
    let todoTitle=req.url.slice(12).replace(/%20/gi,' ');
    let todo=dbContent.find(todoDetail=>todoDetail.title==todoTitle);
    todo.checked=false;
    fs.writeFileSync('../data/todoRecords.json',JSON.stringify(dbContent,null,2));
  }
};

handlerModules.getMultipleTodoViewPageContent=function(req,res){
  let todoTitle=req.url.slice(9).replace(/%20/gi,' ');
  let todoRecordsList=JSON.parse(getFileContent('../data/todoRecords.json'));
  let pageContent=getFileContent('../public/view.html');
  let multipleTodos=parseLinks(todoRecordsList,req);

  let parsedTodo=parseDeleteEditButton(req,todoRecordsList,todoTitle);
  pageContent=pageContent.replace('_Preview',parsedTodo);
  pageContent=pageContent.replace('_Links',multipleTodos);
  return pageContent
}

handlerModules.serveButtonActioninView=function(req,res){
  let dbContent=JSON.parse(getFileContent('../data/todoRecords.json'));
  if(req.url.startsWith('/viewTodo')){

    let pageContent=handlerModules.getMultipleTodoViewPageContent(req,res);
    handlerModules.setContentType('../public/view.html',res);
    res.write(pageContent);
    res.end();
  }
  if(req.url.startsWith('/deleteTodo')){

    let todoTitle=req.url.slice(11).replace(/%20/gi,' ');
    let content=dbContent.filter((todo)=>{return todo.title != todoTitle});

    fs.writeFileSync('../data/todoRecords.json',JSON.stringify(content,null,2));
    res.redirect('/view.html');
  }
  if(req.url.startsWith('/editTodo')&&req.method=='GET'){
    let pageContent=getFileContent('../public/edit.html')
    let todoTitle=req.url.slice(9).replace(/%20/gi,' ');
    let todo=dbContent.find(todoDetail=>todoDetail.title==todoTitle);

    let items=todo.item.join(',');
    items=items.replace(/,/gi,'\n');

    let parsedForm=`<form class="todoDetails" method="POST">Title<br>`;
    parsedForm+=`<input id="textbox" type="text" name=title value=${todo.title.replace(/\s/gi,'+')}><br>`;
    parsedForm+=`Description<br><input id="textbox" type="text" name=description value=${todo.description.replace(/\s/gi,'+')}><br>`;
    parsedForm+=`Items<br><textarea id="itemTextArea" name=item rows="10" cols="80">${items}</textarea><br>`;
    parsedForm+=`<input type="submit"></form>`;

    pageContent=pageContent.replace('_Element',parsedForm);
    res.write(pageContent);
    res.end();
  }
  if(req.url.startsWith('/editTodo')&&req.method=='POST'){

    let todoTitle=req.url.slice(9).replace(/%20/gi,' ');
    let todo=dbContent.find(todoDetail=>todoDetail.title==todoTitle);

    todo.title=req.body.title.replace(/%2B/gi,' ');
    todo.description=req.body.description.replace(/%2B/gi,' ');
    todo.item=req.body.item.split('%0D%0A');

    fs.writeFileSync('../data/todoRecords.json',JSON.stringify(dbContent,null,2));
    res.redirect('/view.html');
  }
}

handlerModules.getIndexPage=function(req,res){
  let fileContent=getFileContent('../public/index.html');
  fileContent=fileContent.replace('Hi User',`Hi ${req.user.userName}`);
  handlerModules.setContentType('../public/index.html',res);

  res.write(fileContent);
  res.end();
};

handlerModules.getLoginPage=function(req,res){
  loadRegisteredUsers();
  let fileContent=getFileContent('../public/login.html');
  res.setHeader('Content-type','text/html');

  res.write(fileContent);
  res.end();
};

handlerModules.getViewPage=function(req,res){

  let fileContent=getFileContent('../public/view.html');
  let dbContent=JSON.parse(getFileContent('../data/todoRecords.json'));

  let multipleTodos=parseLinks(dbContent,req);
  fileContent=fileContent.replace('_Links',multipleTodos);
  fileContent=fileContent.replace('Hi User',` Hi ${req.user.userName}`);

  handlerModules.setContentType('../public/view.html',res);
  res.write(fileContent);
  res.end();
};

handlerModules.getCreateTodoPage=function(req,res){
  let fileContent=getFileContent('../public/create.html');
  fileContent=fileContent.replace('Hi User',`Hi ${req.user.userName}`);
  handlerModules.setContentType('../public/create.html',res);

  res.write(fileContent);
  res.end();
};

handlerModules.postTodoAction=function(req,res){

  let dbContentList=JSON.parse(getFileContent('../data/todoRecords.json'));

  req.body.username=req.user.userName;
  let itemsList=req.body['item'].split('%0D%0A');
  req.body.item=itemsList;
  dbContentList.push(req.body);
  let filePath=process.env.TODO_STORE || '../data/todoRecords.json';
  fs.writeFileSync(filePath,JSON.stringify(dbContentList,null,2));

  let fileContent=getFileContent('../public/create.html');
  let parsedTodo=parseTodoToHTML(req.body,req);

  fileContent=fileContent.replace('_Preview',parsedTodo);
  fileContent=fileContent.replace('Visible','hidden');
  handlerModules.setContentType('../public/create.html',res);

  res.write(fileContent);
  res.end();
};

handlerModules.validatePostUserData=function(req,res){
  let user = getUserData(req);
  if(!user) {
    res.setHeader('Set-Cookie',[`logInFailed=true; Max-Age=5`]);
    res.redirect('/login.html');
    return;
  }
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

handlerModules.getHomePage=function(req,res){
  res.redirect('login.html')
};

handlerModules.redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/','/login.html']) && req.user) res.redirect('/index.html');
}

handlerModules.redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/','/index.html','/create.html','/view.html','/edit.html','/logout']) && !req.user) res.redirect('/login.html');
}
