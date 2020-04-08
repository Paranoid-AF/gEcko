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
  console.log($(".searchInput").val());
  if($(".searchInput").val() === ""){
    $(".searchFormFake").show();
    $(".searchForm").hide();
    $(".search").css("background", "var(--search-box-inactive, #fff)");
    searchBoxShown = false;
  }
});