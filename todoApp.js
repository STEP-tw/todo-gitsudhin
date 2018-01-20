const WebApp = require('./webapp.js');
const handlerModules=require('./custom_handlers/handler.js');
const AllHandlers=require('./custom_handlers/composite_handler.js');
const StaticFileHandler=require('./custom_handlers/static_file_handler.js');

let serverFile=new StaticFileHandler('./public');
let handlers=new AllHandlers();
handlers.addHandler(serverFile);

let app = WebApp.create();

app.use(handlerModules.logRequest);
app.use(handlerModules.loadUser);
app.use(handlerModules.redirectLoggedInUserToHome);
app.use(handlerModules.redirectLoggedOutUserToLogin);

// app.post('/login.html',handlerModules.validateUser);
// app.get('/index.html',handlerModules.getIndexPage);
// app.get('/logout',handlerModules.logoutUser);
// app.get('/view.html',handlerModules.getViewPage);
// app.post('/create.html',handlerModules.postTodoAction);
// app.get('/create.html',handlerModules.getCreateTodoPage);

app.postprocess(handlers.requestHandler());
// app.postprocess(handlerModules.serveButtonActioninView);
// app.postprocess(handlerModules.markTodoStatus);
// app.postprocess(handlerModules.serveStaticFiles);

module.exports=app;
