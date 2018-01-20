let DefaultHandler=require('./default_handler.js');
class TodoHandler extends DefaultHandler {
  constructor() {
    super();
  }
  execute(req,res){
    if (req.url.startsWith('/todo')) {
      let id=req.url.slice(req.url.lastIndexOf('/')+1);
      res.setHeader('Set-Cookie',`todoId=${id}`);
      res.redirect('/showTodo.html');
    }
  }
}
module.exports=TodoHandler;
