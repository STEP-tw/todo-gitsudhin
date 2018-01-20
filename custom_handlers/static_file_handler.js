let fs=require('fs');
let DefaultHandler=require('./default_handler.js');
class StaticFileHandler extends DefaultHandler {
  constructor(path,fs) {
    super();
    this.path=path;
  }
  getPath(url){
    return `${this.path}/${url}`;
  }
  execute(req,res){
    let filePath=this.getPath(req.url);
    if (fs.existsSync(filePath)){
      let fileText = fs.readFileSync(filePath);
      res.write(fileText);
      res.end();
      return;
    }
    this.handleInvalidURL(req,res);
  }
  handleInvalidURL(req,res){
    res.statusCode=404;
    res.write(`${req.url} not found`);
    res.end();
  }
}
module.exports=StaticFileHandler;
