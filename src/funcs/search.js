import $ from "jquery";
var searchBoxShown = false;
const showSearchBox = () => {
  $(".searchFormFake").hide();
  $(".searchForm").show();
  $(".searchInput").focus();
  $(".search").css("background", "var(--search-box-active, #fff)");
  searchBoxShown = true;
}

$(".search").click(showSearchBox);
$(".search").contextmenu(()=>{
  let shouldAllowMenu = searchBoxShown;
  showSearchBox();
  return shouldAllowMenu;
});

if($(".searchInput").val() !== ""){
  $(".searchFormFake").hide();
  $(".searchForm").show();
  searchBoxShown = true;
}

$(".searchInput").blur(()=>{
  if($(".searchInput").val() === ""){
    $(".searchFormFake").show();
    $(".searchForm").hide();
    $(".search").css("background", "var(--search-box-inactive, #fff)");
    searchBoxShown = false;
  }
});

$("#search").submit(function(e) {
  const baseUrl = e.target.getAttribute("baseurl");
  if(!!baseUrl){
    let domain = baseUrl.match(/\/\/(.+?)[:\/]/);
    if(!!domain[1]){
      const input = e.target.getElementsByTagName("input")[0].value;
      e.target.getElementsByTagName("input")[0].value = `site:${domain[1]} ` + input;
      setTimeout(() => {
        e.target.getElementsByTagName("input")[0].value = input;
      }, 50);
      return;
    }
  }
  e.preventDefault();
});