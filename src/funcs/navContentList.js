import $ from 'jquery';
var lastScrollY = window.pageYOffset;

var navBarTransparent = false;

let titles;
$(document).ready(function(){
    titles = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")];
    if(pageInfo.isPost){
    try{
      lastScrollY = window.pageYOffset;
      prepareNavContent();
      titles.forEach((elem) => {
        observer.observe(elem);
      });
    }catch(err){
      $(".navContent").css("display", "none");
      lockBlur = true;
    }

    $(".navContentWrapper .list").click((e) => {
      if(e.target.tagName.toLowerCase() === "span"){
        lockClearify = true;
        lockActive = true;
        const targetTitle = titles[e.target.parentElement.getAttribute("index")];
        targetTitle.scrollIntoView();
        window.location.hash = encodeURI(targetTitle.innerText);
        setTimeout(() => {
          lockActive = false;
          setActive(-1, e.target.parentElement);
        }, 100);
        
        setTimeout(() => {
          lockClearify = false;
        }, 500);
      }
    });

    $(".navContentWrapper .backToTop").click(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
    
    $(".navContentWrapper .close").click(() => {
      clearifyNav();
    });

    $(window).scroll((e) => {
      if(!pageInfo.isPost){
        return;
      }
      if(window.pageYOffset <= 0){
        $(".navContentWrapper .backToTop").css("opacity", "0");
        $(".navContentWrapper .backToTop").css("pointer-events", "none");
      }else{
        $(".navContentWrapper .backToTop").css("opacity", "1");
        $(".navContentWrapper .backToTop").css("pointer-events", "auto");
      }
      if(lastScrollY < window.pageYOffset){
          // Scroll down.
          navBarTransparent = true;
          handleTransparency();
      }
      lastScrollY = window.pageYOffset;
    });
    const handleTransparency = () => {
      if(!pageInfo.mobile){
        if(navBarTransparent){
          blurNav();
        }else{
          clearifyNav();
        }
      }
    };
  }
});

function prepareNavContent(){
  function getLevel(elem){
    return Number(elem.tagName.match(/\d+/g).pop());
  }
  function getText(elem){
    return elem.innerText;
  }
  let current = document.createElement("ol");
  current.setAttribute("level", getLevel(titles[0]));
  $(document.querySelector(".navContentWrapper .list")).append(current);

  titles.forEach((elem, index) => {
    const level = getLevel(titles[index]);
    if(index + 1 < titles.length){
      const nextLevel = getLevel(titles[index + 1]);
      if(!isNaN(level)){
        if(current.getAttribute("level") > level.toString()){
          while(current.getAttribute("level") > level.toString()){
            if(current.parentElement !== null && current.parentElement.parentElement !== null && current.parentElement.parentElement.tagName.toLowerCase() === "ol"){
              current = current.parentElement.parentElement;
            }else{
              $(current.parentElement).append(`<ol level=${getLevel(elem).toString()}></ol>`);
              current = current.parentElement.lastChild;
              break;
            }
          }
        }
        if(level < nextLevel){
          $(current).append(`<li index=${index}><span>${getText(elem)}</span><ol level=${getLevel(titles[index+1]).toString()}></ol></li>`);
          current = current.lastChild.lastChild;
        }else{
          $(current).append(`<li index=${index}><span>${getText(elem)}</span></li>`);
        }
        }
    }else{
      $(current).append(`<li index=${index}><span>${getText(elem)}</span></li>`);
    }
  });
}

var lockBlur = false;
var lockClearify = false;
function blurNav(){
  if(!lockBlur){
    $(".navWrapper").css("filter", "blur(10px)");
    $(".navWrapper").css("pointer-events", "none");
    $(".navWrapper").css("opacity", "0.2");
    $(".navWrapper").css("user-select", "none");
    $(".navContent").css("opacity", "1");
    $(".navContent").css("z-index", "2");
  }
}

function clearifyNav(){
  if(!lockClearify){
    $(".navWrapper").css("filter", "none");
    $(".navWrapper").css("pointer-events", "auto");
    $(".navWrapper").css("opacity", "1");
    $(".navWrapper").css("user-select", "auto");
    $(".navContent").css("opacity", "0");
    $(".navContent").css("z-index", "-1");
  }
}


var lockActive = false;

function setActive(index, elem = null){
  if(!lockActive){
    const navLists = document.querySelectorAll(".navContentWrapper .list li");
    navLists.forEach((elem) => {
      elem.className = "";
    });
    if(elem === null){
      navLists[index].className = "active";
    }else{
      elem.className = "active";
    }
  }
}

const observer = new IntersectionObserver((entries)=>{
  let targetIndex = -1;
  if(entries.length === 1){
    // One and only coming.
    if(entries[0].isIntersecting){
      targetIndex = titles.indexOf(entries[0].target);
    }
  }else{

    let lastTrue = null;
    entries.every((entry) => {
      if(entry.isIntersecting){
        lastTrue = entry;
        return false;
      }else{
        return true;
      }
    });
    if(lastTrue !== null){
      targetIndex = titles.indexOf(lastTrue.target);
      if(targetIndex < 0){
        targetIndex = 0;
      }
    }
  }
  if(targetIndex >= 0){
    setActive(targetIndex);
  }
}, {
  threshold: 1
});

export default clearifyNav;