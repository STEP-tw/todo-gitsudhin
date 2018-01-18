class TodoItem{
  constructor(item){
    this.item=item;
    this.itemChecked=false;
  }
  markAnItemAsDone(item){
    this.itemChecked=true;
  }
  markAnItemAsNotDone(item){
    this.itemChecked=false;
  }
}
module.exports=TodoItem;
