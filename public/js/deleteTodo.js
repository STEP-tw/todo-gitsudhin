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
