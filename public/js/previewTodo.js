const viewTodo=function(id){
  let xmlHttpReq=new XMLHttpRequest();
  xmlHttpReq.addEventListener('load',displayLink);
  xmlHttpReq.open('POST','/preview');
  xmlHttpReq.send(`todoId=${id}`);
};

const displayLink=function(){
  let todos=this.responseText;
  document.getElementById('previewBlock').innerHTML=todos;
}
