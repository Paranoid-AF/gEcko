import $ from 'jquery';
$(document).ready(function(){
  // Add description on the bottom of each image.


  // Scroll to anchored position
  const urlHash = decodeURI(window.location.hash).match(/\#(.*)/);
  let titles = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")];
  
  titles.every((elem) => {
    if(urlHash !== null && elem.innerText === urlHash[1]){
    console.log(elem);
    elem.scrollIntoView();
    return false;
    }
    return true;
  });
});
