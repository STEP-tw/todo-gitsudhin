const WebApp = require('../server/webapp.js');
const handlerModules=require('./handler.js');

let app = WebApp.create();

app.use(handlerModules.logRequest);
app.use(handlerModules.loadUser);
app.use(handlerModules.redirectLoggedInUserToHome);
app.use(handlerModules.redirectLoggedOutUserToLogin);

app.get('/',handlerModules.getHomePage);
app.get('/login.html',handlerModules.getLoginPage);
app.post('/login.html',handlerModules.validatePostUserData);
app.get('/index.html',handlerModules.getIndexPage);
app.get('/logout',handlerModules.logoutUser);
app.get('/view.html',handlerModules.getViewPage);
app.post('/create.html',handlerModules.postTodoAction);
app.get('/create.html',handlerModules.getCreateTodoPage);
app.postprocess(handlerModules.serveButtonActioninView);
app.postprocess(handlerModules.markItemAsDone);
app.postprocess(handlerModules.serveStaticFiles);

module.exports=app;
