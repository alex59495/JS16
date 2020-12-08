let text = '';
for(let i=0; i<11; i++) {
  text += `${i} x 5 = ${i*5} <br>`;
}
document.querySelector('#recup-div').innerHTML = text