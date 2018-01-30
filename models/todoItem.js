class TodoItem{
  constructor(text){
    this.text=text;
    this._isDone=false;
  }

  markAsDone() {
    return this._isDone=true;
  }

  markAsNotDone() {
    return this._isDone=false;
  }

  isDone() {
    return this._isDone;
  }
}
module.exports=TodoItem;
