let getTextBox = function() {
 let boxSpace = document.getElementById('additem');
 let box = document.createElement('textarea');
 let newLine =document.createElement('br');
 box.name = 'item';
 box.rows = '2';
 box.cols = '80';
 boxSpace.appendChild(box);
 boxSpace.appendChild(newLine);
};
