//var validateContactCaptcha = function (response) {
//    $('#contact-form').find('input[name="recaptcha"]').val(response);
//};
var clientEncrptKey = null;
$("#name").on("keyup", function () {
  var re = $("#name").val();
  if (re == "") {
    $("#errorsAll").css("display", "inline-block");
  } else {
    $("#errorsAll").css("display", "none");
  }
});
$("#emailId").on("keyup", function () {
  var re = $("emailId").val();
  if (re == "") {
    $("#errorsAll").css("display", "inline-block");
  } else {
    $("#errorsAll").css("display", "none");
  }
});
$("#drlocation").on("change", function () {
  var re = $("#drlocation").val();
  if (re == "Select Location") {
    $("#errorsAll").css("display", "inline-block");
  } else {
    $("#errorsAll").css("display", "none");
  }
});
$("#phone").on("keyup", function () {
  var re = $("#phone").val();
  if (re == "") {
    $("#errorsAll").css("display", "inline-block");
  } else {
    $("#errorsAll").css("display", "none");
  }
});
$("#comment").on("keyup", function () {
  var re = $("#phone").val();
  if (re == "") {
    $("#errorsAll").css("display", "inline-block");
  } else {
    $("#errorsAll").css("display", "none");
  }
});
$("#privacy").on("click", function () {
  if ($(this).is(":checked") == true) {
    $("#errorsAll").css("display", "none");
  } else {
    $("#errorsAll").css("display", "inline-block");
  }
});

$("#submitContact").click(async function (e) {
  e.preventDefault();
  $("#contact-form")
    .validate({
      rules: {
        name: {
          required: true,
        },
        email: {
          email: true,
          required: true,
        },
        phone: {
          required: true,
          //                    number: true,
          //                    maxlength: 10,
          //                    minlength:10
        },
        message: {
          required: true,
        },
      },
      messages: {
        name: { required: "Please enter your name" },
        email: { required: "Please enter your email address" },
        phone: {
          required: "Please enter your phone number",
          //                    maxlength: jQuery.validator.format("Please enter {0} digits."),
          //                    minlength: jQuery.validator.format("Please enter {0} digits.")
        },
        message: "Please enter your message",
      },
      focusCleanup: true,
      onfocusout: function (element) {
        $(element).valid();
      },
      tooltip_options: {
        name: { placement: "bottom" },
        email: { placement: "bottom" },
        phone: { placement: "bottom" },
        message: { placement: "bottom" },
      },
    })
    .form();

  var name = $("#name").val();
  var email = $("#emailId").val();
  var contact_number = $("#phone").val();
  var message = $("#comment").val();
  var location = $("#drlocation").val("");
  var location_id = $("#location_dropdown").val();
  var subject = "";
  if ("#subject".length) {
    subject = $("#subject").val();
  }
  var recaptcha = $("#contact-form").find('input[name="recaptcha"]').val();

  var contact_form = $("#contact-form");
  contact_form.validate();
  if (
    name == "" ||
    email == "" ||
    contact_number == "" ||
    message == "" ||
    location == "" ||
    $("#privacy").is(":checked") == false ||
    recaptcha == "" ||
    contact_form.valid() == false
  ) {
    $("#errorsAll").css("display", "inline-block");
  } else {
    var data = {
      name: name,
      email: email,
      contact_number: contact_number,
      message: message,
      subject: subject,
      g_recaptcha_response: recaptcha,
      location_id: location_id,
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
          contact_number: encryptClientData(data.contact_number),
        };
      }

      $.ajax({
        dataType: "json",
        type: "POST",
        url: GP_WEBSITES_API_URL + "/api/website/contacts/",
        headers: { "GP-Host": window.location.hostname },
        data: data,
        success: function () {
          if (contact_success_redirect.length > 1) {
            window.location = website_url + contact_success_redirect;
          } else if ($("#success-popup").length > 0) {
            $("p.dynamic-text").text(contact_popup_success_text);
            $("#success-popup").modal("show");
          } else {
            $("#success-contact").modal("show");
          }
          // $("#success-contact").modal("show");
          $("#contact-form")[0].reset();
          $("#reviewModal").modal("hide");
          $("#name").val("");
          $("#emailId").val("");
          $("#phone").val("");
          $("#comment").val("");
          $("#drlocation").val("");
          $("#privacy").prop("checked", false);
          resetContactCaptcha();
        },
        error: function () {
          $("#error-contact").modal("show");
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
});
