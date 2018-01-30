const deleteTodo=function(id){
  let xmlHttpReq=new XMLHttpRequest();
  xmlHttpReq.addEventListener('load',displayNewLinks);
  xmlHttpReq.open('POST','/deleteTodo');
  xmlHttpReq.send(`todoID=${id}`);
};

const displayNewLinks=function(){
  let todoTitles=this.responseText;
  document.getElementById('inputDataBlock').innerHTML=todoTitles;
}

const editTodo=function(id){
  let xmlHttpReq=new XMLHttpRequest();
  xmlHttpReq.addEventListener('load',giveEditPage);
  xmlHttpReq.open('POST','/editTodo');
  xmlHttpReq.send(`todoID=${id}`);
}
const giveEditPage=function(){
  let newTodo=this.responseText;
  document.getElementById('inputDataBlock').innerHTML=newTodo;
}
