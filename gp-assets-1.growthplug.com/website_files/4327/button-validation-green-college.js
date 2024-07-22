$(document).ready(function () {
    $('input[name="insurance have"]').click(function () {
      if (($(this).attr("value")) == "Yes") {
        $(".boxR").show();
        $(".box1").hide();
        $('#patientname1').val('');

      }
      else {
        $(".boxR").hide();
        $(".box1").show();
        $('#patientname1').val('');
      }
    });

  });