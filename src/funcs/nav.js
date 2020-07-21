import "./search.js";
import $ from "jquery";
var mobile = false, forceOn = false;
const responsiveThreshold = 749;
const navTransition = 0.4; // second
const calibrateSize = () => {
  mobile = $(window).width() < responsiveThreshold;
  if(mobile){
    clearifyNav();
    $(".navClose").show();
    if(forceOn){
      $(".nav").show();
      showNav(true);
      showOverlay();
    }else{
      hideNav(true);
      hideOverlay();
    }
  }else{
    $(".nav").show();
    hideOverlay();
    $(".navClose").hide();
    showNav(true);
  }
}

$(".navOverlay").click(()=>{
  $(".navClose").click();
});

$(".navClose").click(() => {
  hideNav();
  hideOverlay();
  forceOn = false;
});

$(".navButton").click(()=>{
 showNav();
  if(mobile){
    showOverlay();
  }
  forceOn = true;
});

const showNav = (instant = false) => {
  $(".nav").show();
  $(".nav").css("left", 0);
}

const hideNav = (instant = false) => {
  if(instant){
    $(".nav").hide();
    setTimeout(()=>{
      $(".nav").show();
    }, navTransition * 1000);
  }
  $(".nav").css("left", "-" + $(".nav").css("width"));
}

const showOverlay = () => {
  $(".navOverlay").show();
}

const hideOverlay = () => {
  $(".navOverlay").hide();
}

$(window).resize(()=>{
  calibrateSize();
  gradientControl();
});

$(document).ready(()=>{
  calibrateSize();
  randomizeSplashText();
  gradientControl();
});

$("#siteInfoDescription #switch").click(() => {
  randomizeSplashText(true);
});

var currentSplashText = -1;
var switchedCount = 0;
const randomizeSplashText = (rotateSwitch = false) => {
  if(pageInfo !== undefined && pageInfo.splashText !== undefined && pageInfo.splashText.length > 0){
    let randomIndex;
    if(pageInfo.splashText.length == 1){
      randomIndex = 0;
    }else{
      do{
        randomIndex = Math.random() * pageInfo.splashText.length;
        randomIndex = Math.floor(randomIndex);
      }while(randomIndex === currentSplashText);
    }
    currentSplashText = randomIndex;
    $("#siteInfoDescription #switch").css("display", "inline-block");
    if(rotateSwitch){
      switchedCount++;
      $("#siteInfoDescription #switch").css("transform", "rotate("+(switchedCount * 180)+"deg)");
    }
    $("#siteInfoDescription #text").text(pageInfo.splashText[currentSplashText]);
  }
}

$(window).scroll(() => {
  gradientControl();
});

const gradientControl = () => {
  let transitionTime = 200;
  if(mobile){
    if($(window).scrollTop() > 55){
      $(".navGradient").fadeIn(transitionTime);
    }else{
      $(".navGradient").fadeOut(transitionTime);
    }
  }else{
    $(".navGradient").fadeOut(transitionTime);
  }
}

/* Handle nav content */
var lastScrollY = window.pageYOffset;

var navBarTransparent = false;

$(window).scroll((e) => {
  if(!pageInfo.isPost){
    return;
  }
  if(lastScrollY < window.pageYOffset){
      // Scroll down.
      navBarTransparent = true;
  }else{
      // Scroll up.
      navBarTransparent = false;
  }
  handleTransparency();
  lastScrollY = window.pageYOffset;
});
const handleTransparency = () => {
  if(!mobile){
    if(navBarTransparent){
      blurNav();
    }else{
      clearifyNav();
    }
  }
};

$(window).on('load', function(){
  lastScrollY = window.pageYOffset;
  prepareNavContent();
  titles.forEach((elem) => {
    observer.observe(elem);
  })
});

const titles = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")];
function prepareNavContent(){
  function getLevel(elem){
    return Number(elem.tagName.match(/\d+/g).pop());
  }
  function getText(elem){
    return elem.innerText;
  }
  let current = document.createElement("ol");
  current.setAttribute("level", getLevel(titles[0]));
  document.querySelector(".navContentWrapper .list").append(current);

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

$(".navContentWrapper .backToTop").click(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

$(".navContentWrapper .close").click(() => {
  clearifyNav();
});

var lockActive = false;

$(".navContentWrapper .list").click((e) => {
  if(e.target.tagName.toLowerCase() === "span"){
    lockClearify = true;
    lockActive = true;
    titles[e.target.parentElement.getAttribute("index")].scrollIntoView();
    setTimeout(() => {
      lockActive = false;
      setActive(-1, e.target.parentElement);
    }, 1);
    
    setTimeout(() => {
      lockClearify = false;
    }, 500);
  }
});

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
  if(entries.length === 1 && !entries[0].isIntersecting){
    targetIndex = titles.indexOf(entries[0].target);
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
    targetIndex = titles.indexOf(lastTrue.target) - 1;
    if(targetIndex < 0){
      targetIndex = 0;
    }
  }
  if(targetIndex >= 0){
    setActive(targetIndex);
  }
}, {
  threshold: 1
});

