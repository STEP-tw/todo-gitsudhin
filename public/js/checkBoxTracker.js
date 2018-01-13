function check() {
  let list=document.querySelectorAll('input');
  list.forEach((cb)=>{
    let title=cb.id.slice(3);
    console.log(document.getElementById(cb.id).checked);
    console.log(title);
  })
}
