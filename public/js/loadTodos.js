const viewTodoTitles=function(){
  let xmlHttpReq=new XMLHttpRequest();
  xmlHttpReq.addEventListener('load',displayLinks);
  xmlHttpReq.open('GET','/viewTodo');
  xmlHttpReq.send();
};

const displayLinks=function(){
  let todoTitles=this.responseText;
  document.getElementById('inputDataBlock').innerHTML=todoTitles;
}
window.onload=viewTodoTitles;
