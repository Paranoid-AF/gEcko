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
  const titleList = $('.post-content.contentArea').find('h1, h2, h3, h4, h5, h6');
  let iterParent = null;
  const docTree = [ ];
  
  /*
  let testDrive = {
    content: "current title",
    type: 1,
    parent: null,
    child: [ ],
    html: <h1></h1>
  }
  */

  titleList.each((index, val) => {
    const currentTitle = { };
    currentTitle["html"] = val;
    currentTitle["content"] = val.innerText;
    currentTitle["type"] = parseInt(val.tagName.match(/H(\d?)/)[1]);
    while(iterParent !== null){
      if(iterParent.type < currentTitle["type"]){
        break;
      }
      if(iterParent.parent === null){
        iterParent = null;
        break;
      }
      if(iterParent.type >= currentTitle["type"]){
        iterParent = iterParent.parent;
      }
    }
    currentTitle["parent"] = iterParent;
    currentTitle["children"] = [ ];
    currentTitle["index"] = index;
    if(iterParent === null){
      docTree.push(currentTitle);
    }else{
      iterParent.children.push(currentTitle);
    }
    iterParent = currentTitle;
  })
  let rootLevel = Infinity;
  let currentNode = null;
  function spawnChildren(parentLi, docInfo){
    docInfo.children.forEach((val, index) => {
      const childLi = $(`<ol level="${val.type}"><li index="${val.index}"><span>${val.content}</span></li></ol>`)
                    .appendTo(parentLi)
                    .find('li')[0];
      spawnChildren(childLi, val);
    });
  }
  docTree.forEach((val, index) => {
    if(index > 0){
      if(val.type < docTree[index - 1].type){
        $('.navContentWrapper .list').append(currentNode);
        currentNode = document.createElement('ol');
        currentNode.setAttribute('level', val.type.toString());
      }
    }else{
      currentNode = document.createElement('ol');
      currentNode.setAttribute('level', val.type.toString());
    }
    let parentNode = $(`<li index="${val.index}"><span>${val.content}</span></li>`).appendTo(currentNode)[0];
    // Spawn children
    spawnChildren(parentNode, val);

    if(index === docTree.length - 1){
      $('.navContentWrapper .list').append(currentNode);
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