const deleteItem=function(id){
  let xmlHttpReq=new XMLHttpRequest();
  xmlHttpReq.addEventListener('load',showRemainingItems);
  xmlHttpReq.open('POST',`/deleteItem/${id}`);
  xmlHttpReq.send();
};

const showRemainingItems=function(){
  let todo=this.responseText;
  document.getElementById('previewBlock').innerHTML=todo;
}

const editText=function (id) {
  let editBox=`<form method="post">
  <input type="text" value=${id} name="itemId" hidden>
  <input type="text" name="newText">&nbsp
  <input type="submit" value="Save changes"></form>`;
  document.getElementById(`${id}`).innerHTML=editBox;
}
