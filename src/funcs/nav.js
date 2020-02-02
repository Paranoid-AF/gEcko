import "./search.js";
import $ from "jquery";
var mobile = false, forceOn = false;
const responsiveThreshold = 765;
const animationDuration = 180;

const calibrateSize = () => {
  mobile = $(window).width() < responsiveThreshold;
  if(mobile){
    $(".navClose").show();
    if(forceOn){
      $(".nav").show();
      showOverlay();
    }else{
      $(".nav").hide();
      hideOverlay();
    }
  }else{
    hideOverlay();
    $(".navClose").hide();
    $(".nav").show();
  }
}

$(".navOverlay").click(()=>{
  console.log("aaa");
  $(".navClose").click();
});

$(".navClose").click(() => {
  $(".nav").fadeOut(animationDuration);
  hideOverlay();
  forceOn = false;
});

$(".container").click(()=>{
  $(".nav").fadeIn(animationDuration);
  if(mobile){
    showOverlay();
  }
  forceOn = true;
});

const showOverlay = () => {
  $(".navOverlay").show();
}

const hideOverlay = () => {
  $(".navOverlay").hide();
}

$(window).resize(()=>{
  calibrateSize();
});

$(document).ready(()=>{
  calibrateSize();
});
