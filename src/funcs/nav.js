import $ from "jquery";
var searchBoxShown = false;
const showSearchBox = () => {
  $(".searchFormFake").hide();
  $(".searchForm").show();
  $(".searchInput").focus();
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
    searchBoxShown = false;
  }
});