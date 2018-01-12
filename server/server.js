let fs = require('fs');
const timeStamp = require('./time.js').timeStamp;
const http = require('http');
const WebApp = require('./webapp');

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

const writeToFile=function(content,filename){
  let existingData=getFileContent(filename);
  let newData=JSON.parse(existingData);
  newData.unshift(content);
  fs.writeFileSync(filename,JSON.stringify(newData,null,2));
};

const parseLinks=function(dbContent,req){
  let content=`<ol>`;
  let todosOfThisUser=dbContent.filter((todo)=>{
    return todo.username==req.user.userName;
  });
  todosOfThisUser.forEach((todo)=>{
    content+=`<li><a href="/view.html"><button name="todo1">${todo.title}</button></a></li>`;
  })
  content+=`</ol>`;
  console.log(content);
  return content;
};

const parseTodoToHTML=function(todoObj){
  let content=`<h2>${todoObj.title}</h2><br><h3>${todoObj.description}</h3>`;
  let itemsList=Object.keys(todoObj).slice(3);
  itemsList.forEach((item)=>{
    content+=`<br><br><input type="checkbox" >${todoObj[item]}`;
  })
  return content;
};

const getLoginPage=function(req,res){
  let fileContent=getFileContent('../public/login.html');
  res.setHeader('Content-type','text/html');
  if(req.cookies.logInFailed){
    // res.write('Login Failed');
  }
  res.write(fileContent);
  res.end();
};

const getViewPage=function(req,res){
  let fileContent=getFileContent('../public/view.html');
  let dbContent=JSON.parse(getFileContent('../data/todoRecords.json'));
  let todos=dbContent.find(todo=>todo.username==req.user.userName);
  let parsedTodo=parseTodoToHTML(todos);
  let multipleTodos=parseLinks(dbContent,req);
  fileContent=fileContent.replace('_Preview',parsedTodo);
  fileContent=fileContent.replace('_Links',multipleTodos);
  setContentType('../public/view.html',res);
  res.write(fileContent);
  res.end();
};

const getUserData=function(req){
  console.log(req.body);
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
app.postprocess(serveStaticFiles);

const PORT = 9000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
