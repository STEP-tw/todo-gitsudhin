const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const handlerModules=require('./custom_handlers/handler.js');
const AllHandlers=require('./custom_handlers/composite_handler.js');
const StaticFileHandler=require('./custom_handlers/static_file_handler.js');
let reg_users=[{"userName":"sudhin","name":"Sudhin MN","password":"123"}];

app.sessionIdGenerator=function(){
  return new Date().getTime();
}


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(handlerModules.logRequest);
app.use(handlerModules.loadUser);
app.use(handlerModules.redirectLoggedInUserToHome);
app.use(handlerModules.redirectLoggedOutUserToLogin);
app.use(express.static('public'));


app.post('/login',handlerModules.validateUser.bind(app));
app.post('/create.html',handlerModules.createTodo);
app.get('/viewTodo',handlerModules.viewTodos);
app.post('/preview',handlerModules.previewTodo);
app.get('/logout',handlerModules.logoutUser);
app.post('/deleteTodo',handlerModules.deleteTodo);
app.post('/deleteTodo',handlerModules.deleteTodo);
app.post('/editTodo',handlerModules.editTodo);
app.post('/deleteItem/:id',handlerModules.deleteItem);
app.post('/view.html',handlerModules.saveEditedItem);

// app.postprocess(handlers.requestHandler());
// app.postprocess(handlerModules.serveButtonActioninView);
// app.postprocess(handlerModules.markTodoStatus);
// app.postprocess(handlerModules.serveStaticFiles);

module.exports=app;
