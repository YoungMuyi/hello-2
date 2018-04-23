//@ sourceURL=public.js
//取消增加（隐藏增加模块）
  $(".add_cancel").click( function() {

      $(".add-box").addClass("collapsed-box");
      $(".add-box-body").css("display", "none");
      $("#add_fa_btn").removeClass("fa-minus").addClass("fa-plus");
      $(".add_input").each(function () {
          $(this).val("");
      });
  });


function DisplayAddbox(){
    $(".add-box").removeClass("collapsed-box");
    $(".add-box-body").css("display","block");
    $("#add_fa_btn").addClass("fa-minus").removeClass("fa-plus");
}




//重置search form
$(".search_reset").click( function() {
    $(".search-table").find('input').each(function () {
        $(this).val("");
    });
    }
)

//重置add form
$(".add_reset").click( function() {
    $(".add-table").find('input').each(function () {
        $(this).val("");
    });    }
);

$(window).load(function(){
    $(".dataTables_length").detach().insertAfter(".dataTables_info")
});