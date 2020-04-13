import "./search.js";
import $ from "jquery";
var mobile = false, forceOn = false;
const responsiveThreshold = 765;
const navTransition = 0.4; // second
const calibrateSize = () => {
  mobile = $(window).width() < responsiveThreshold;
  if(mobile){
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
  if(typecho !== undefined && typecho.splashText !== undefined && typecho.splashText.length > 0){
    let randomIndex;
    if(typecho.splashText.length == 1){
      randomIndex = 0;
    }else{
      do{
        randomIndex = Math.random() * typecho.splashText.length;
        randomIndex = Math.floor(randomIndex);
      }while(randomIndex === currentSplashText);
    }
    currentSplashText = randomIndex;
    $("#siteInfoDescription #switch").css("display", "inline-block");
    if(rotateSwitch){
      switchedCount++;
      $("#siteInfoDescription #switch").css("transform", "rotate("+(switchedCount * 180)+"deg)");
    }
    $("#siteInfoDescription #text").text(typecho.splashText[currentSplashText]);
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