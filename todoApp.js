const timeStamp = require('./server/time.js').timeStamp;
const WebApp = require('./server/webapp.js');
const fs = require('fs');

let registered_users = [
  {userName:'sudhin',name:'Sudhin MN',password:'123'},
  {userName:'sreenadh',name:'Sreenadh S',password:'123'}];

let toStr = obj=>JSON.stringify(obj,null,2);

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toStr(req.headers)}`,
    `COOKIES=> ${toStr(req.cookies)}`,
    `BODY=> ${toStr(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

let serveStaticFiles=function(req,res){
  let fileUrl='../public'+req.url;
  if(fs.existsSync(fileUrl)){
    try{
      let fileContent=getFileContent(fileUrl,null);
      setContentType(fileUrl,res);
      res.write(fileContent);
      res.end();
    }catch(ex){}
  }
};

const getContentType=function(extension){
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

const setContentType=function(fileUrl,res){
  let extension=fileUrl.slice(fileUrl.lastIndexOf('.'));
  let contentType=getContentType(extension);
  res.setHeader('content-type',contentType);
};

const getFileContent=function(file,encoding='utf8'){
  return fs.readFileSync(file,encoding);
};

const parseLinks=function(dbContent,req){
  let todosOfThisUser=dbContent.filter((todo)=>{
    return todo.username==req.user.userName;
  });

  let content=`<ol>`;
  todosOfThisUser.forEach((todo)=>{
    content+=`<li><a href="/view.html"><button name="todo1">${todo.title}</button></a></li>`;
  });

  content+=`</ol>`;
  return content;
};

const parseTodoToHTML=function(todoObj,req){
  let content=`<h2>${todoObj.title}</h2><br><h3>${todoObj.description}</h3>`;
  let itemsList=todoObj.item;
  if(req.method=='POST'){
    itemsList=todoObj['item'].split('%0D%0A');
    todoObj.item=itemsList;
  }
  itemsList.forEach((item)=>{
    content+=`<br><br><input type="checkbox" >${item}`;
  });
  return content;
};

const getLoginPage=function(req,res){
  let fileContent=getFileContent('../public/login.html');
  res.setHeader('Content-type','text/html');

  res.write(fileContent);
  res.end();
};

const getViewPage=function(req,res){

  let fileContent=getFileContent('../public/view.html');
  let dbContent=JSON.parse(getFileContent('../data/todoRecords.json'));

  let todos=dbContent.find(todo=>todo.username==req.user.userName);
  let parsedTodo=parseTodoToHTML(todos,req);
  let multipleTodos=parseLinks(dbContent,req);

  fileContent=fileContent.replace('_Preview',parsedTodo);
  fileContent=fileContent.replace('_Links',multipleTodos);

  setContentType('../public/view.html',res);
  res.write(fileContent);
  res.end();
};

const redirectToLoginIfNotValidUser=function(req,res){
  let user=getUserData(req);
  if(!user){
    res.redirect('/login.html');
    return
  }
};

const getCreateTodoAction=function(req,res){

};

const postTodoAction=function(req,res){

  let dbContentList=JSON.parse(getFileContent('../data/todoRecords.json'));

  req.body.username=req.user.userName;
  dbContentList.push(req.body);

  fs.writeFileSync('../data/todoRecords.json',JSON.stringify(dbContentList,null,2));

  let fileContent=getFileContent('../public/create.html');
  let parsedTodo=parseTodoToHTML(req.body,req);

  fileContent=fileContent.replace('_Preview',parsedTodo);
  fileContent=fileContent.replace('Visible','hidden');
  setContentType('../public/create.html',res);

  res.write(fileContent);
  res.end();
};

const getUserData=function(req){
  return registered_users.find(u=>u.userName==req.body.userName&&u.password==req.body.pwd);
};

const validatePostUserData=function(req,res){
  let user = getUserData(req);
  if(!user) {
    res.setHeader('Set-Cookie',[`logInFailed=true`,'Max-Age=5']);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/index.html');
};

const logoutUser=function(req,res){
  console.log("Entering");
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid || {};
  res.redirect('/login.html');
};

const getHomePage=function(req,res){
  res.redirect('login.html')
};

let app = WebApp.create();

app.use(logRequest);
app.use(loadUser);

app.get('/',getHomePage);
app.get('/login.html',getLoginPage);
app.post('/login.html',validatePostUserData);
app.get('/logout',logoutUser);
app.get('/view.html',getViewPage);
app.post('/create.html',postTodoAction);
app.get('/create.html',getCreateTodoAction);
app.postprocess(serveStaticFiles);

module.exports=app;
