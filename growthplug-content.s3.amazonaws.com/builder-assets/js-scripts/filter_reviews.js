if (itemPerPage === undefined) {
  var itemPerPage = 6;
}

var monkeyList = [];
//Pagination
var validateReviewCaptcha = function (response) {
  $('#reviews-form input[name="recaptcha"]').val(response);
};

$(document).ready(function () {
  // initialize with defaults
  $("#input-2").rating();

  // with plugin options (do not attach the CSS class "rating" to your input if using this approach)
  $("#input-2").rating({ size: "md" });

  var getData = $("#parent-box .read-more");

  var getMore = $("#parent-box .more");
  for (var i = 0; i < getData.length; i++) {
    if (getData[i].innerText.length < 120) {
      if (getMore[i] != undefined) {
        getMore[i].style.display = "none";
      }
    }
  }
  $("#parent-box .more").click(function () {
    var getHtml = $(this).parent().parent().find(".get-attr").html();
    var getText = $(this).parent().find(".read-more").text();
  });
  if ($(".name").length > 0) {
    monkeyList = new List("parent-box", {
      valueNames: ["name"],
      page: itemPerPage,
      pagination: [
        {
          outerWindow: 1,
          innerWindow: 1,
        },
      ],
    });
    validatePagination("*");
  }

  //Filter of reviews
  $btns = $("#reviews-content .filter").click(function () {
    var filterValue = $(this).attr("data-filter");
    //        console.log("filter Value", filterValue);
    validatePagination(filterValue);
    $("#reviews-content .filter").each(function (item) {
      $(this).parent().removeClass("active");
    });
    $(this).parent().addClass("active");
  });

  function alignSingleReview() {
    if ($(".name").length == 1) {
      $(".name").addClass("col-md-offset-3");
    } else {
      $(".name").removeClass("col-md-offset-3");
    }
  }

  function validatePagination(filterValue) {
    var totalItems = 0;

    try {
      monkeyList.filter(function (item) {
        if (filterValue == "*" || item.elm.dataset["category"] == filterValue) {
          totalItems += 1;
          return true;
        } else {
          return false;
        }
      });
    } catch (err) {
      console.log(err);
    }

    var paging = document.getElementById("paging");
    if (paging) {
      if (totalItems > itemPerPage) {
        paging.style.display = "block";
      } else {
        paging.style.display = "none";
      }
    }
    alignSingleReview();
  }
});
