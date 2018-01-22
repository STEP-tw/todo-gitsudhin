const deleteItem=function(id){
  let xmlHttpReq=new XMLHttpRequest();
  xmlHttpReq.addEventListener('load',showEditedTodo);
  xmlHttpReq.open('POST','/handleItem');
  xmlHttpReq.send(`id=${id}&action=delete`);
};

const editItem=function(id){
  let xmlHttpReq=new XMLHttpRequest();
  xmlHttpReq.addEventListener('load',showEditedTodo);
  xmlHttpReq.open('POST','/handleItem');
  xmlHttpReq.send(`id=${id}&text=${text}&action=edit`);
};

const showEditedTodo=function(){
  let todo=this.responseText;
  document.getElementById('previewBlock').innerHTML=todo;
}
