
$(function () {
    $("#submitReview").click(function (e) {
        e.preventDefault();
        $('#reviews-form').validate({
            rules: {
                name: {
                  required: true
                },
                email: {
                    email: true,
                    required: true
                },
                message:{
                    required: true
                }
            },
            messages: {
                name: {required: "Please enter your name"},
                email: {required:"Please enter your email address"},
                message: "Please enter your message"
            },
            focusCleanup: true,
            onfocusout: function(element) {$(element).valid()},
            tooltip_options: {
               name: { placement: 'bottom' },
               email: { placement: 'bottom' },
               message: { placement: 'bottom' }

            }
        }).form();
    });
});