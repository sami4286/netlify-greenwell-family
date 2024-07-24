// Combined js for appointment Versions 1 and 2
// div id ='speciality-service' is compulsory for V2 and mustnot be used in V1
var height;
var loc_pref = 2;
var selected_location_data = null;
var clientEncrptKey = null;
//Dynamic component - one which can switch appointment form based on time based/preference based working hour selection from console
var dynamic_component = false;

if (document.getElementById("pref-based")) {
  dynamic_component = true;
  console.log("dynamic", dynamic_component);
}

$(function () {
  var locationId = "";
  var countLengthOfDoctor = $("#appointment #profile .col-md-6").length;
  var countLengthOfLocation = $("#appointment #home .col-md-6").length;

  if ($("#locationdropdown").length > 0) {
    $("#locationdropdown").on("change", function () {
      var locationId = this.value;
      filterDocForLocationVersion1(locationId);
      $('#appointment-form input[name="location"]').val(locationId);
      showLocationDays(locationId);
    });
  }
  if ($("#teamdropdown").length > 0) {
    $("#teamdropdown").on("change", function () {
      var docname = $("#teamdropdown  option:selected").text();
      $('#appointment-form input[name="Preferred"]').val("Dr " + docname);
      var memberId = this.value;
      $('#appointment-form input[name="member"]').val(memberId);
    });
  }

  $("[data-get-location]").click(function (e) {
    e.preventDefault();
    locationId = $(this).attr("data-get-location");
    $('#appointment-form input[name="location"]').val(locationId);
    filterServiceForLocation(locationId);
    showLocationDays(locationId);
    const selectedLocation = location_data.filter(
      (loc) => loc.id === parseInt(locationId, 10)
    );
    if (selectedLocation.length) {
      getSelectedLocation(selectedLocation[0].address, selectedLocation[0].id);
    }
    var href = $(this).attr("href");
    $("[aria-controls]").parent().removeClass("active");
    $("#appointment .tabs .tab-pane").removeClass("active");
  });

  $("[data-get-service]").click(function (e) {
    e.preventDefault();
    var serviceId = $(this).attr("data-get-service");
    $('#appointment-form input[name="speciality"]').val(serviceId);
    var serviceName = $(this).attr("data-get-speciality");
    filterDocForLocation(parseInt(locationId, 10), parseInt(serviceId, 10));
    getServiceDetails(serviceName);
    $("[aria-controls]").parent().removeClass("active");
    $("#appointment .tabs .tab-pane").removeClass("active");
  });
  $("[data-id]").click(function (e) {
    e.preventDefault();
    team_memberId = $(this).attr("data-id");
    $('#appointment-form input[name="member"]').val(team_memberId);
    const selectedTeam = teams.filter(
      (team) => team.id === parseInt(team_memberId, 10)
    );
    if (selectedTeam.length) {
      getUserDetails(
        selectedTeam[0].profile_pic_cropped,
        selectedTeam[0].name,
        selectedTeam[0].specialty,
        selectedTeam[0].id
      );
    }
  });

  $("[data-select-team]").click(function (e) {
    e.preventDefault();
    team_memberId = $(this).attr("data-select-team");
    $('#appointment-form input[name="member"]').val(team_memberId);
  });

  $(".recent-box").click(function () {
    var memberId = $(this).data("id");
    $("[aria-controls]").parent().removeClass("active");
    // $("[aria-controls='messages']").parent().addClass("active");
  });
  $("[data-select-team]").click(function (e) {
    e.preventDefault();
    var teamId = $(this).attr("data-select-team");
    getAvailablityOfLocandDoc(parseInt(teamId, 10));
  });
  //Setting Default location and doctor
  var firstLocation = $("[data-get-location]").first();
  if (firstLocation.length > 0) {
    var locationId = firstLocation.data("get-location");
    showLocationDays(locationId);
    $('#appointment-form input[name="location"]').val(locationId);
  }

  $(".datepicker").datepicker({
    format: "yyyy-mm-dd",
    orientation: "bottom",
    container: "#datetimepicker1",
  });
  $("#datetimepicker1").on("changeDate", function (ev) {
    $(this).datepicker("hide");
  });
  $("#selected-doc-image-mob").attr(
    "src",
    $("input[name='member-image']").data("src")
  );
  $("#selected-doc-image").attr(
    "src",
    $("input[name='member-image']").data("src")
  );
  $("#selected-doc-name").text($("input[name='member-name']").data("name"));
  $(".selected-doc-name").text($("input[name='member-name']").data("name"));
  $(".selected-doc-spec").text(
    $("input[name='member-speciality']").data("speciality")
  );
  var team_memberId = "";
  if ($('#appointment-form input[name="member"]').val() == "") {
    team_memberId = $('#appointment input[name="member-id"]').data("id");
  } else {
    team_memberId = $('#appointment-form input[name="member"]').val();
  }
  //CHANGES DONE BY SAMAD
  // if(team_memberId){
  //     getAvailablityOfLocandDoc(team_memberId,locationId,serviceId)
  // }
  ///////////////////////////
  $("#appointment #speciality-service #profile .recent-box").on(
    "click",
    function () {
      $(this).parents().find("#appointment .modal-content").addClass("height");
    }
  );

  $(".location-box").on("click", function () {
    $(this).parents().find("#appointment .modal-content").addClass("height");
    height = $("#appointment").height();
  });

  $(".previous-location").on("click", function () {
    $(this).parents().find(".select-service").removeClass("active");
    $(this).parents().find(".select-doctor").removeClass("active");
    $(this).parents().find(".fill-form").removeClass("active");
    $(this).parents().find(".select-location").addClass("active");
    $(this).parents().find("#appointment .modal-content").removeClass("height");
  });
  $(".previous-service").on("click", function () {
    $(this).parents().find(".select-doctor").removeClass("active");
    $(this).parents().find(".fill-form").removeClass("active");
    $(this).parents().find(".select-service").addClass("active");
    $(this).parents().find("#appointment .modal-content").removeClass("height");
  });

  $(".previous-doctor").on("click", function () {
    $(this).parents().find(".fill-form").removeClass("active");
    $(this).parents().find(".select-doctor").addClass("active");
  });

  // Theme 2 related
  $("#patientTypeWithSwitch").on("change", function (e) {
    patient_type = this.checked ? "New Patient" : "Existing Patient";
    if (patient_type == "New Patient") {
      patient_type = false;
    } else {
      patient_type = true;
    }
    $("#patient_type").val(patient_type);
  });

  $("#appointment-form")
    .submit(function (e) {
      e.preventDefault();
    })
    .validate({
      rules: {
        firstname: {
          required: true,
        },
        lastname: {
          required: true,
        },
        email: {
          email: true,
          required: true,
        },
        phone: {
          required: true,
          number: true,
          maxlength: 10,
          minlength: 10,
        },
        days: {
          required: true,
        },
        times: {
          required: true,
        },
        //CHANGES DONE BY SAMAD

        date_slot: {
          required: true,
        },
        dob: {
          required: false,
        },
        reasonforvisit: {
          required: false,
        },
        ///////////////////////
      },
      messages: {
        firstname: { required: "Please enter your first name" },
        lastname: { required: "Please enter your last name" },
        email: {
          required: "Please enter your email address",
        },
        phone: {
          required: "Please enter your phone number",
          maxlength: jQuery.validator.format("Please enter {0} digits."),
          minlength: jQuery.validator.format("Please enter {0} digits."),
        },
        days: {
          required: "Please select a day",
          //                    maxlength: jQuery.validator.format("Please enter {0} digits."),
          //                    minlength: jQuery.validator.format("Please enter {0} digits.")
        },
        times: {
          required: "Please select a timing",
          //                    maxlength: jQuery.validator.format("Please enter {0} digits."),
          //                    minlength: jQuery.validator.format("Please enter {0} digits.")
        },
        //CHANGES DONE BY SAMAD
        date_slot: {
          required: "Please select a timing",
        },
        //                dob: {
        //                    required: "Date of birth required"
        //
        //                },
        // reasonforvisit: {
        //     required: "Please select a reason for visit"

        // }
        //////////////////////
      },
      focusCleanup: true,
      onfocusout: function (element) {
        $(element).valid();
      },
      tooltip_options: {
        firstname: { placement: "bottom" },
        lastname: { placement: "bottom" },
        email: { placement: "bottom" },
        phone: { placement: "bottom" },
        reasonforvisit: { placement: "bottom" },
      },
      //Submit Handler Function
      submitHandler: function (form) {
        console.log("here");
        serialized_form_data = $("#appointment-form").serialize();
        attributes = serialized_form_data.split("&");
        attributes_dict = {};
        accepted_keys = [
          "g-recaptcha-response",
          "location",
          "recaptcha",
          "member",
          "locationdropdown",
          "teamdropdown",
          "days",
          "times",
          "email",
          "firstname",
          "lastname",
          "phone",
          "patientType",
          "date_slot",
          "dob",
          "reasonforvisit",
          "speciality",
        ];
        attributes.forEach(function (attr) {
          var key = attr.split("=")[0];
          var value = attr.split("=")[1];
          key = key
            .replace(/\+/g, " ")
            .replace(/\%2F/g, "-")
            .replace(/\%2C/g, ",")
            .replace(/\%3A/g, ":");
          if (value != "") {
            if (!accepted_keys.includes(key)) {
              attributes_dict[key] = value
                .replace("%40", "@")
                .replace(/\+/g, " ")
                .replace(/\%2F/g, "-")
                .replace(/\%2C/g, ",")
                .replace(/\%3A/g, ":");
            }
          }
        });
        var team_memberId = "";
        if ($('#appointment-form input[name="member"]').val() == "") {
          team_memberId = $('#appointment input[name="member-id"]').data("id");
          if (isNaN(team_memberId)) {
            team_memberId = $('#appointment input[name="member-id"]').data(
              "select-team"
            );
          }
        } else {
          team_memberId = $('#appointment-form input[name="member"]').val();
        }

        //CHANGED DONE BY SAMAD
        day_time_or_date_timing = false;
        if (
          $('#appointment-form input[name="date_slot"]:checked').length > 0 ||
          ($('#appointment-form input[name="days"]:checked').length > 0 &&
            $('#appointment-form input[name="times"]:checked').length > 0)
        ) {
          day_time_or_date_timing = true;
        }

        var specialityId = $(
          '#appointment-form input[name="speciality"]'
        ).val();
        var reasonforvisit = document.getElementById("reasonforvisit");
        if (reasonforvisit) {
          specialityId = reasonforvisit.value;
        }
        if (specialityId == "others" || specialityId == "Consultation") {
          specialityId = null;
        }
        ////////////////
        if (
          $("#appointment-form input[name='firstname']").val() == "" ||
          $("#appointment-form input[name='lastname']").val() == "" ||
          $("#appointment-form input[name='email']").val() == "" ||
          $('#appointment-form input[name="recaptcha"]').val() == "" ||
          $("#appointment-form input[name='phone']").val().length < 10 ||
          !day_time_or_date_timing ||
          specialityId == "placeholder"
        ) {
          $("#errorAll").css("visibility", "visible");
        } else {
          var selectedDays = [];
          if ($('#appointment-form input[name="days"]:checked').length > 0) {
            $('#appointment-form input[name="days"]:checked').each(function (
              e
            ) {
              console.log("selected day", $(this).val());
              selectedDays.push($(this).val());
            });
          }

          //            else{
          //                selectedDays.push($('#appointment-form input[name="days"]').val());
          //            }
          var selectedTimes = [];
          if ($('#appointment-form input[name="times"]:checked').length > 0) {
            $('#appointment-form input[name="times"]:checked').each(function (
              e
            ) {
              selectedTimes.push($(this).val());
            });
          }
          //            else{
          //                 $('#appointment-form input[name="times"]').each(function (e) {
          //                    selectedTimes.push($(this).val());
          //                  });
          //            }
          //CHANGES DONE BY SAMAD
          times = selectedTimes.join(", ");
          days = selectedDays.join(", ");
          appointment_date = "";
          timing_start = "";
          timing_end = "";
          if (
            $('#appointment-form input[name="date_slot"]:checked').length > 0
          ) {
            appointment_date_timing = $(
              '#appointment-form input[name="date_slot"]:checked'
            )
              .val()
              .split(",");
            appointment_date = appointment_date_timing[0];
            appointment_date = appointment_date + "T00:00:00Z";
            timing_start = appointment_date_timing[1];
            timing_end = appointment_date_timing[2];
          }
          dob = $("#appointment-form input[name='dob']").val();
          if (dob) {
            let dateFormat = new Date(dob);
            let formatedDOB = [
              dateFormat.getFullYear(),
              dateFormat.getMonth() + 1,
              dateFormat.getDate(),
            ].join("-");
            dob = formatedDOB + "T00:00:00Z";
          }
          if (loc_pref == 1 || (!selectedDays && !selectedTimes)) {
            days = appointment_date;
            times = timing_start + "-" + timing_end;
          }

          /////////////////////
          patient_type = $(
            "#appointment-form input[name='patientType']:checked"
          ).val();
          patient_name = "";
          if ($("#appointment-form input[name='firstname']").val()) {
            patient_name = $("#appointment-form input[name='firstname']").val();
          }
          if ($("#appointment-form input[name='lastname']").val()) {
            patient_name =
              patient_name +
              " " +
              $("#appointment-form input[name='lastname']").val();
          }
          if (patient_type == undefined) {
            patient_type = $("#patient_type").val();
            if (patient_type == "New Patient" || patient_type === "false") {
              patient_type = false;
            } else {
              patient_type = true;
            }
          } else if (typeof patient_type != "boolean") {
            if (patient_type == "New Patient") {
              patient_type = false;
            } else {
              patient_type = true;
            }
          }
          var data = {
            reason: "consultation",
            insurance: "insurance",
            location: parseInt(
              $('#appointment-form input[name="location"]').val()
            ),
            days: days,
            time: times,
            patient_name: patient_name,
            email: $("#appointment-form input[name='email']").val(),
            mobile: $("#appointment-form input[name='phone']").val(),
            existing_patient: patient_type,
            g_recaptcha_response: $(
              '#appointment-form input[name="recaptcha"]'
            ).val(),
            team_member: parseInt(team_memberId),
            extra_data: JSON.stringify(attributes_dict),
            //CHANGED DONE BY SAMAD
            appointment_date: appointment_date,
            from_time: timing_start,
            to_time: timing_end,
            dob: dob,
            speciality: specialityId,
            ////////////////////
          };
          var website_url =
            window.location.protocol + "//" + location.host.split(":")[0];
          try {
            if (clientEncKey) clientEncrptKey = clientEncKey;
          } catch (e) {
            console.log("clientEnc not found");
          }
          try {
            if (clientEncrptKey) {
              data = {
                ...data,
                patient_name: encryptClientData(data.patient_name),
                email: encryptClientData(data.email),
                mobile: encryptClientData(data.mobile),
              };
            }
            $.ajax({
              dataType: "json",
              type: "POST",
              url: GP_WEBSITES_API_URL + "/api/website/appointments/",
              headers: { "GP-Host": window.location.hostname },
              data: data,
              success: function (json) {
                if (appointment_success_redirect.length > 1) {
                  $.ajax({
                    type: "get",
                    url: appointment_success_redirect,
                    statusCode: {
                      404: function () {
                        $("#success-appointment").modal("show");
                      },
                      200: function () {
                        window.location =
                          website_url + appointment_success_redirect;
                      },
                    },
                  });
                } else if ($("#success-popup").length > 0) {
                  $("p.dynamic-text").text(appointment_popup_text);
                  $("#success-popup").modal("show");
                } else {
                  $("#success-appointment").modal("show");
                }
                $("#appointment-form")[0].reset();

                $("#appointment").modal("hide");
                resetAppointmentCaptcha();
              },
              error: function (json) {
                $("#error-appointment").modal("show");
              },
            });
          } catch (e) {
            console.log(e);
          }
        }
      },
    });

  $("#success-popup").on("hidden.bs.modal", function () {
    location.reload();
  });
  $("#success-appointment").on("hidden.bs.modal", function () {
    location.reload();
  });
  // TEST CODE BLOCK
  $("#appointment").on("hidden.bs.modal", function () {
    var tabs = $(this).find(".modal-body").find(".tabs > div");
    $(this).find("form").trigger("reset");
    if (tabs.length > 1) {
      tabs.removeClass("active");
      $(tabs[0]).addClass("active");
    }
    $("#appointment-form .tooltip").remove();
    resetAppointmentCaptcha();
    $("#errorAll").css("visibility", "hidden");
  });
});

function showLocationDays(locationId) {
  var locationId = parseInt(locationId);
  console.log("dyn", dynamic_component);
  selected_location_data = location_data.filter(
    (loc) => loc.id === locationId
  )[0];
  var total_timings = selected_location_data["working_hours"].length;
  var i;
  var highlightFirstDay = false;
  for (i = 0; i < total_timings; i++) {
    var location_timing = selected_location_data["working_hours"][i];
    var dayText = location_timing["days"];
    $("#checkbox-" + (i + 1)).prop("checked", false);
    if (location_timing.off) {
      $("#appointment-form div.inline[data-day='" + dayText + "']").hide();
    } else {
      if (!dynamic_component) {
        $("#appointment-form div.inline[data-day='" + dayText + "']").show();
      } else {
        //For hiding days marked as 'working', but no sessions like morning/afternoon/eve are selected
        var flex_times = selected_location_data.flexible_timings;
        flex_times.forEach(function (day) {
          if (day.key == dayText) {
            off_day = true;
            day.value.forEach(function (slot) {
              console.log("off entered", slot.value);
              if (slot.value) {
                off_day = false;
              }
            });
            if (off_day) {
              $(
                "#appointment-form div.inline[data-day='" + dayText + "']"
              ).hide();
            } else {
              $(
                "#appointment-form div.inline[data-day='" + dayText + "']"
              ).show();
            }
          }
        });
      }
      if (!highlightFirstDay && dynamic_component) {
        console.log(i + 1);
        $("#checkbox-" + (i + 1))
          .prop("checked", true)
          .trigger("change");
        highlightFirstDay = true;
      }
    }
  }
}

function getUserDetails(image, name, speciality, id) {
  $("#selected-doc-image-mob").attr("src", image);
  $("#selected-doc-image").attr("src", image);
  $("#selected-doc-name").text(name);
  $(".selected-doc-name").text(name);
  $(".selected-doc-spec").text(speciality);
}
function getServiceDetails(speciality) {
  $(".selected-service").text(speciality);
  $("#selected-service").text(speciality);
}

function getSelectedLocation(name, location_id) {
  $(".selected_location").text(name);
  const locationIndex = location_data.findIndex(
    (loc) => loc.id === location_id
  );
  var selected_location_data = location_data[locationIndex];
  loc_pref = selected_location_data["preference"];
  if (loc_pref == null) {
    loc_pref = 2;
  }
}

function getSelectedLocationPhone(location, phone) {
  $(".selected_location").text(location);
  $(".selected_phone").text(phone);
}

// Updates Done by Judith

function showSlider() {
  var setInvisible = function (elem) {
    elem.css("visibility", "hidden");
  };
  var setVisible = function (elem) {
    elem.css("visibility", "visible");
  };

  var elem = $(".availablity-items-div");
  var items = elem.children();

  // insert arrow buttons
  elem.prepend(
    '<div id="right-button" style="visibility: hidden;"><a href="#"><</a></div>'
  );
  elem.append('  <div id="left-button"><a href="#">></a></div>');
  items.wrapAll('<div id="inner" />');
  elem.find("#inner").wrap('<div id="builder-dynamic-outer"/>');

  var outer = $("#builder-dynamic-outer");

  var updateUI = function () {
    var maxWidth = outer.outerWidth(true);
    var actualWidth = 0;
    $.each($("#inner >"), function (i, item) {
      actualWidth += $(item).outerWidth(true);
    });

    if (actualWidth <= maxWidth) {
      setVisible($("#left-button"));
    }
  };
  updateUI();

  $("#right-button").click(function () {
    var leftPos = outer.scrollLeft();
    outer.animate(
      {
        scrollLeft: leftPos - 200,
      },
      800,
      function () {
        //   debugger;
        if ($("#outer").scrollLeft() <= 0) {
          setInvisible($("#right-button"));
        }
      }
    );
  });

  $("#left-button").click(function () {
    setVisible($("#right-button"));
    var leftPos = outer.scrollLeft();
    outer.animate(
      {
        scrollLeft: leftPos + 200,
      },
      800
    );
  });

  $(window).resize(function () {
    updateUI();
  });
}
// ******************************** For slots based on Clinic's Business Hours (Not considering doctor's timings)****************
//For time slots based on business-hours of the clinic
function getAvailablityOfLocandDoc(team_member_id, location_id, service_id) {
  if (!location_id) {
    location_id = $('#appointment-form input[name="location"]').val();
  }
  if (!service_id) {
    service_id = $('#appointment-form input[name="speciality"]').val();
  }
  //Dynamic component - Appointment slots are days and sessions if preference based timing is selected in console,else timeslots
  // var dynamic_component = false;
  // if (document.getElementById('pref-based')) {
  //     dynamic_component = true;
  // }

  if (
    dynamic_component == false ||
    (dynamic_component == true && loc_pref == 1)
  ) {
    $("#pref-based").hide();

    $("#time-based").show();

    $(".loader").attr("style", "visibility: visible");

    $(".availablity-items-div").empty();
    var data = {
      location_id: location_id,
      team_member: team_member_id,
      service_id: service_id,
    };
    $.ajax({
      dataType: "json",
      type: "GET",
      url:
        GP_WEBSITES_API_URL +
        "/api/appointment/appointments/v2/get-appointment-availability/",
      headers: { "GP-Host": window.location.hostname },
      data: data,
      success: function (data) {
        if (data[0].length > 1) {
          showslots(data);
        } else {
          failure_msg();
        }
      },
      error: function () {
        failure_msg();
      },
    });
  } else {
    $(".loader").attr("style", "visibility: hidden");
    $("#time-based").hide();
    $("#pref-based").show();
  }
}

//****************************** For slots based on Selected Doctor's Timings*****************************/
// For time slots based on doctor timings
function getDoctorSlots(team_member_id, location_id, service_id) {
  if (!location_id) {
    location_id = $('#appointment-form input[name="location"]').val();
  }
  if (!service_id) {
    service_id = $('#appointment-form input[name="speciality"]').val();
  }
  if (
    dynamic_component == false ||
    (dynamic_component == true && loc_pref == 1)
  ) {
    $("#pref-based").hide();

    $("#time-based").show();
    $(".loader").attr("style", "visibility: visible");

    $(".availablity-items-div").empty();
    var data = {
      location_id: location_id,
      team_member: team_member_id,
      service_id: service_id,
    };
    $.ajax({
      dataType: "json",
      type: "GET",
      url:
        GP_WEBSITES_API_URL +
        "/api/appointment/appointments/v2/get-doctor-availability/",
      headers: { "GP-Host": window.location.hostname },
      data: data,
      success: function (data) {
        if (data[0].length > 1) {
          showslots(data);
        } else {
          failure_msg();
        }
      },
      error: function () {
        failure_msg();
      },
    });
  } else {
    $(".loader").attr("style", "visibility: hidden");
    $("#time-based").hide();
    $("#pref-based").show();
  }
}

//To display timeslots on success response from api call getAvailablityOfLocandDoc and getDoctorSlots
function showslots(data) {
  var item_div = "";
  $(".availablity-items-div").append(item_div);
  data.forEach(function (item, index) {
    var more_length = 0;
    var html = "";
    item.forEach(function (day, index) {
      var time_slot = "";
      var time_slots = "";
      var more = "";
      var class_name = parseInt(day.date_and_month.split(" ").join(""));
      if (day.week_of === false) {
        if (day.time_slots.length >= 4) {
          more =
            '<p class="builder-dynamic-slots-more"><a type="button" onclick="hide_and_show_slots(' +
            class_name +
            ')">MORE..</a></p>';
        }
        day.time_slots.forEach(function (time, index) {
          var Id = parseInt(time.start);
          var inputId =
            time.start.split(" ")[0].split(":").join("") + Id + class_name;
          var day_date_and_month = parseInt(day.date_and_month);
          if (index <= 4) {
            time_slot +=
              '<li class="' +
              class_name +
              "-show " +
              class_name +
              '-slot-item" id=' +
              index +
              "><input onclick=timingCheckboxClick(" +
              inputId +
              "," +
              day_date_and_month +
              '); id="' +
              inputId +
              '" class=builder-dynamic-check name=date_slot type=checkbox value="' +
              day.date +
              "," +
              time.start +
              "," +
              time.end +
              '"><label for=' +
              day.date_and_month +
              "-" +
              time.start +
              " class=builder-dynamic-v2><span>" +
              time.start +
              "</span></label></li>";
          } else {
            time_slot +=
              '<li class="' +
              class_name +
              "-hide " +
              class_name +
              '-slot-item" id=' +
              index +
              ' style="display:none"><input onclick=timingCheckboxClick(' +
              inputId +
              "," +
              day_date_and_month +
              '); id="' +
              inputId +
              '" class=builder-dynamic-check name=date_slot type=checkbox value="' +
              day.date +
              "," +
              time.start +
              "," +
              time.end +
              '"><label for=' +
              day.date_and_month +
              "-" +
              time.start +
              " class=builder-dynamic-v2><span>" +
              time.start +
              "</span></label></li>";
          }
        });
        time_slots =
          '<ul class="builder-dynamic-time-list"> ' + time_slot + "</ul>";
      } else {
        more = "";
      }
      html +=
        "<div class=builder-dynamic-app-v2 days-group data-day=" +
        day.day +
        '><div class="builder-dynamic-checkbox-custom-circle" id=' +
        day.date_and_month +
        "><span>" +
        day.day +
        "</span></div><h6>" +
        day.date_and_month +
        "</h6>" +
        time_slots +
        more +
        "</div>";
    });
    $(".loader").attr("style", "visibility: hidden");
    $(".availablity-items-div").append(html);
  });
  showSlider();
}

function failure_msg() {
  $("#appointment").modal("toggle");
  $("#pageMessage").modal("toggle");
}

//********************************End of slots logic ************************/

//Function to get doctor id/service from class attrs
// ids are of format (loc+service-loc+service*doc) or (loc-loc-loc*serviceid)
//Splits doc-id or service id from this id string
function getDoctorOrServiceIdandLocations(ids) {
  var ser_or_doc;
  doc_n_locations = ids.split("*");
  ser_or_doc = doc_n_locations[doc_n_locations.length - 1];
  locations = ids.substring(0, ids.indexOf(ser_or_doc) - 1);
  return [locations, ser_or_doc];
}

//To filter doctors for a loc and service pair
function filterDocForLocation(location_id, service_id) {
  var single_doc;
  var elements = $("[data-doc-location]");
  var doc_count = 0;
  //For showing onlly services mapped specifically to a location
  elements.each(function (index) {
    var ids = $(this).data("doc-location").replace(/\s+/g, "").trim();
    if (ids.length > 0) ids = ids.replaceAll(",", "");
    [locations, doc] = getDoctorOrServiceIdandLocations(ids);
    ids = locations.split("-");
    ids = ids.filter(function (v) {
      return v !== "+";
    });
    if (ids.length >= 0 && ids.indexOf(location_id + "+" + service_id) < 0) {
      $(this).hide();
    } else {
      $(this).show();
      doc_count = doc_count + 1;
      single_doc = doc;
    }
  });

  //Logic to hide 'doctor tab' for single doc
  if (doc_count <= 1) {
    if (doc_count <= 0) {
      $('a[data-get-service^="' + service_id + '"]').each(function () {
        var oldUrl = $(this).attr("href");
        var newUrl = oldUrl.replace("#profile", "#home");
        $(this).attr("href", newUrl);
      });
      $('a[data-get-location^="' + location_id + '"]').each(function () {
        var oldUrl = $(this).attr("href"); // Get current url
        var newUrl = oldUrl.replace("#profile", "#home"); // Create new url
        $(this).attr("href", newUrl); // Set href value
      });
      $("#appointment").modal("toggle");
      $("#pageMessage").modal("toggle");
      return;
    } else {
      $('a[data-get-location^="' + location_id + '"]').each(function () {
        var oldUrl = $(this).attr("href"); // Get current url
        var newUrl = oldUrl.replace("#profile", "#messages"); // Create new url
        $(this).attr("href", newUrl); // Set href value
      });
      $('a[data-get-service^="' + service_id + '"]').each(function () {
        var oldUrl = $(this).attr("href");
        var newUrl = oldUrl.replace("#profile", "#messages");
        $(this).attr("href", newUrl);
      });
      $("#profile").removeClass("active");
      $("#messages").addClass("active");
      $('a[data-id^="' + single_doc + '"]').each(function () {
        $(this).trigger("click");
      });
      $('#appointment-form input[name="member"]').val(single_doc);
      if ($("#doc-slot").length) {
        getDoctorSlots(single_doc, location_id, service_id);
      } else {
        getAvailablityOfLocandDoc(single_doc, location_id, service_id);
      }
    }
  }
}

//For Appointment Verison1 - no services
function filterDocForLocationVersion1(location_id) {
  var elements = $("[data-doc-location]");
  elements.each(function (index) {
    var ids = $(this).data("doc-location").replace(/\s+/g, "").trim();
    ids = ids.split("-");
    ids = ids.filter(function (v) {
      return v !== "";
    });
    if (ids.length > 0 && ids.indexOf(location_id) < 0) {
      $(this).hide();
    } else {
      $(this).show();
    }
  });
}

//For Appointment Version2 -with services and date time
//To filter services mapped to a selected Location
function filterServiceForLocation(location_id) {
  //*******div id 'speciality-service' is required for New version Components only.This distinguishes old and new versions of appointment
  if ($("#speciality-service").length < 1) {
    $('#appointment-form input[name="speciality"]').val(null);
    filterDocForLocationVersion1(location_id);
  } else {
    $("a[data-get-service]").each(function () {
      var oldUrl = $(this).attr("href");
      var newUrl = oldUrl
        .replace("#home", "#profile")
        .replace("#messages", "#profile");
      $(this).attr("href", newUrl);
    });
    var service_count = 0;
    var single_service;
    var elements = $("[data-service-location]");
    elements.each(function (index) {
      var ids = $(this).data("service-location").replace(/\s+/g, "").trim();
      [locations, service] = getDoctorOrServiceIdandLocations(ids);
      ids = Array.from(new Set(locations.split("-")));
      ids = ids.filter(function (v) {
        return v !== "";
      });
      if (ids.length >= 0 && ids.indexOf(location_id) < 0) {
        $(this).hide();
      } else {
        $(this).show();
        service_count = service_count + 1;
        single_service = service;
      }
    });

    //Logic to hide 'service tab' for single service only

    if (service_count <= 1) {
      if (service_count <= 0) {
        $('a[data-get-location^="' + location_id + '"]').each(function () {
          var oldUrl = $(this).attr("href"); // Get current url
          var newUrl = oldUrl.replace("#speciality-service", "#home"); // Create new url
          $(this).attr("href", newUrl); // Set href value
        });
        $("#appointment").modal("toggle");
        $("#pageMessage").modal("toggle");
        return;
      } else {
        $('a[data-get-location^="' + location_id + '"]').each(function () {
          var oldUrl = $(this).attr("href"); // Get current url
          var newUrl = oldUrl.replace("#speciality-service", "#profile"); // Create new url
          $(this).attr("href", newUrl); // Set href value
        });
        $('a[data-get-service^="' + single_service + '"]').each(function () {
          var oldUrl = $(this).attr("href");
          var newUrl = oldUrl.replace("#speciality-service", "#profile");
          $(this).attr("href", newUrl);
        });

        $("#speciality-service").removeClass("active");
        $("#profile").addClass("active");
        $('a[data-get-service^="' + single_service + '"]').each(function () {
          $(this).trigger("click");
        });
        $('#appointment-form input[name="speciality"]').val(single_service);
      }
    } else {
      $("#speciality-service").addClass("active");
    }
  }
}

//CHANGES DONE BY SAMAD
function hide_and_show_slots(class_name) {
  var showElements = $("." + class_name + "-show");
  var allSlotItems = $("." + class_name + "-slot-item");
  var hideElements = $("." + class_name + "-hide");
  showElements.each(function (index) {
    showElements[index].style.display = "none";
    showElements[index].classList.add(class_name + "-hide");
    showElements[index].classList.remove(class_name + "-show");
  });
  lengthOfShowsLi = parseInt(showElements.length - 1);
  lengthOfallSlotItems = parseInt(allSlotItems.length - 1);
  lastItemIdofallSlotItems = parseInt(allSlotItems[lengthOfallSlotItems].id);
  lastShowLiId = parseInt(showElements[lengthOfShowsLi].id);
  if (lastShowLiId == lastItemIdofallSlotItems) {
    lastShowLiId = -1;
  }
  for (i = lastShowLiId + 1; i <= lastShowLiId + 5; i++) {
    allSlotItems.each(function (index) {
      if (i == allSlotItems[index].id) {
        allSlotItems[index].style.display = "block";
        allSlotItems[index].classList.add(class_name + "-show");
        allSlotItems[index].classList.remove(class_name + "-hide");
      } else if (allSlotItems[index].style.display != "block") {
        allSlotItems[index].style.display = "none";
        allSlotItems[index].classList.add(class_name + "-hide");
        allSlotItems[index].classList.remove(class_name + "-show");
      }
    });
  }
}
//CHANGES DONE BY SAMAD
function timingCheckboxClick(checkboxId, dayId) {
  var allDays = $(".builder-dynamic-checkbox-custom-circle");
  var allTimingBoxes = $(".builder-dynamic-check");
  allTimingBoxes.each(function (index) {
    if (allTimingBoxes[index].id == checkboxId) {
      allTimingBoxes[index].checked = true;
    } else {
      allTimingBoxes[index].checked = false;
    }
  });
  allDays.each(function (index) {
    if (allDays[index].id == dayId) {
      $(this).css("background-color", "#DB4A34");
      $(this).find("span").css("color", "#FFFFEE");
    } else {
      $(this).css("background-color", "");
      $(this).find("span").css("color", "#DB4A34");
    }
  });
}
$('input[name="days"]').change(function () {
  if (dynamic_component) {
    var weekday = new Array(7);
    weekday[0] = "Monday";
    weekday[1] = "Tuesday";
    weekday[2] = "Wednesday";
    weekday[3] = "Thursday";
    weekday[4] = "Friday";
    weekday[5] = "Saturday";
    weekday[6] = "Sunday";

    var selectedDay = $(this).val();
    selected_location_data.flexible_timings.forEach(function (day) {
      if (day.key == selectedDay) {
        day.value.forEach(function (slot) {
          if (slot.value)
            $(
              "#appointment-form div.inline[data-time='" + slot.key + "']"
            ).show();
          else
            $(
              "#appointment-form div.inline[data-time='" + slot.key + "']"
            ).hide();
        });
      } else {
        var index = weekday.indexOf(day.key) + 1;
        $("#checkbox-" + index).prop("checked", false);
      }
    });
  }
});

// To filter mapped services based on location for single location
var loc = $("#loc");

function updateChange() {
  if ($(loc).val()) {
    filterServiceForLocation($(loc).val());
  }
}

loc.on("change", updateChange);
//To call updateChange only when appointment modal is open
$("#appointment").on("shown.bs.modal", function (e) {
  updateChange();
});

setTimeout(()=> {
  encryptClientData = function(msg) {
    return msg;
  }
},4000);
