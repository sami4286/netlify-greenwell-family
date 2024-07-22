var clientEncrptKey = null;
var validateReviewCaptcha = function (response) {
  $('#reviews-form input[name="recaptcha"]').val(response);
};

$(document).ready(function () {
  // initialize with defaults
  $("#input-2").rating();

  // with plugin options (do not attach the CSS class "rating" to your input if using this approach)
  $("#input-2").rating({ size: "md" });

  $("#reviewName").on("keyup", function () {
    var re = $("#reviewName").val();
    if (re == "") {
      $("#errorReviews").css("display", "inline-block");
    } else {
      $("#errorReviews").css("display", "none");
    }
  });
  $("#reviewComment").on("keyup", function () {
    var re = $("#reviewComment").val();
    if (re == "") {
      $("#errorReviews").css("display", "inline-block");
    } else {
      $("#errorReviews").css("display", "none");
    }
  });
  $("#reviewEmail").on("keyup", function () {
    var re = $("#reviewEmail").val();
    if (re == "") {
      $("#errorReviews").css("display", "inline-block");
    } else {
      $("#errorReviews").css("display", "none");
    }
  });
  $(document).on("click", ".rvw-loc", function () {
    var locationId = $(this).data().loc;
    var locName = $(this).data().locName;
    $("#reviewLocation").val(locationId);
    $("#reviewLocationName").html("Location: " + locName);
  });
  $("#submitReview").click(function () {
    $("#errorReviews").css("display", "none");
    if (
      $('#reviews-form input[name="recaptcha"]').val() == "" ||
      $("#reviewName").val() == "" ||
      $("#reviewComment").val() == "" ||
      $("#reviewEmail").val() == "" ||
      $("input.rating").val() == "" ||
      $("input.rating").val() == "0"
    ) {
      $("#errorReviews").css("display", "inline-block");
    } else {
      var rating = $("input.rating").val();
      var name = $("#reviewName").val();
      var email = $("#reviewEmail").val();
      var message = $("#reviewComment").val();
      var recaptcha = $('#reviews-form input[name="recaptcha"]').val();
      var location_id = $("#reviewLocation").val();
      if (location_data.length == 1) {
        location_id = location_data[0].id;
      }
      var location = parseInt(location_id);
      var data = {
        name: name,
        email: email,
        rating: rating,
        message: message,
        g_recaptcha_response: recaptcha,
        location: location,
      };
      try {
        if (clientEncKey) clientEncrptKey = clientEncKey;
      } catch (e) {
        console.log("clientEnc not found");
      }
      try {
        if (clientEncrptKey) {
          data = {
            ...data,
            name: encryptClientData(data.name),
            email: encryptClientData(data.email),
          };
        }
        $.ajax({
          dataType: "json",
          type: "POST",
          url: GP_WEBSITES_API_URL + "/api/website/reviews/",
          headers: { "GP-Host": window.location.hostname },
          data: data,
          success: function (json) {
            if ($("#success-popup").length > 0) {
              $("p.dynamic-text").text(review_popup_success_text);
              $("#success-popup").modal("show");
            } else {
              if (
                review_success_redirect != "None" &&
                review_success_redirect.length > 1
              ) {
                window.location = website_url + review_success_redirect;
              } else {
                $("#success-reviews").modal("show");
              }
            }
            $("#reviews-form")[0].reset();
            resetReviewCaptcha();
            // $("#success-reviews").modal("show");
            $("#reviewModal").modal("hide");
            $("input.rating").val("");
            $("#reviewName").val("");
            $("#reviewEmail").val("");
            $("#reviewComment").val("");
          },
          error: function (json) {
            $("#error-review").modal("show");
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
  });
});
