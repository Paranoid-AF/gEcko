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

// handle scroll down for transparency
const scrollThreshold = 100;
var lastScrollY = -1;

var navBarTransparent = false;

$(window).scroll((e) => {
  if(!pageInfo.isPost){
    return;
  }
  if(lastScrollY < window.scrollY){
      // Scroll down.
      if(window.scrollY > scrollThreshold){
          navBarTransparent = true;
      }
  }else{
      // Scroll up.
      navBarTransparent = false;
  }
  handleTransparency();
  lastScrollY = window.scrollY;
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
  prepareNavContent();
  blurNav(); // TODO: Remove when ready.
});

function prepareNavContent(){
  document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((elem) => {
    console.log(elem.innerText);
  })
}

function blurNav(){
  $(".navWrapper").css("filter", "blur(10px)");
  $(".navWrapper").css("pointer-events", "none");
  $(".navWrapper").css("opacity", "0.3");
  $(".navWrapper").css("user-select", "none");
  $(".navContent").css("opacity", "1");
  $(".navContent").css("z-index", "2");
}

function clearifyNav(){
  $(".navWrapper").css("filter", "none");
  $(".navWrapper").css("pointer-events", "auto");
  $(".navWrapper").css("opacity", "1");
  $(".navWrapper").css("user-select", "auto");
  $(".navContent").css("opacity", "0");
  $(".navContent").css("z-index", "-1");
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