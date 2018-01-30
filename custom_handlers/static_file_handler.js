class StaticFileHandler{
  constructor(path,fs) {
    this.fs=fs;
    this.path=path;
  }

  getPath(url){
    return `${this.path}/${url}`;
  }

  execute(req,res){
    let filePath=this.getPath(req.url);
    if (this.fs.existsSync(filePath)){
      let fileText = this.fs.readFileSync(filePath);
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

  getRequestHandler(){
    return this.execute.bind(this);
  }
}
module.exports=StaticFileHandler;
