var validateBlogCaptcha = function (response) {
    $('#blog-form input[name="recaptcha"]').val(response);
}

var blogsMonkeyList = [];
var perPageBlogs = 6;
$(function () {
    blogsMonkeyList = new List('blog-box', {
        valueNames: ['single-blog-box'],
        page: perPageBlogs,
        pagination: true,
        pagination: [
            {
                outerWindow: 1,
                innerWindow: 1
            }
        ]
    });

    $('#blogName').on('keyup', function () {
        var re = $('#blogName').val();
        if (re == "") {
            $('#errorBlog').css("display", "inline-block");
        } else {
            $('#errorBlog').css("display", "none");
        }
    });
    $('#blogEmail').on('keyup', function () {
        var re = $('#blogEmail').val();
        if (re == "") {
            $('#errorBlog').css("display", "inline-block");
        } else {
            $('#errorBlog').css("display", "none");
        }
    });
    $('#blogComment').on('keyup', function () {
        var re = $('#blogComment').val();
        if (re == "") {
            $('#errorBlog').css("display", "inline-block");
        } else {
            $('#errorBlog').css("display", "none");
        }
    });

    $("#blog-form").submit(function (e) {
        e.preventDefault();
        if ($("#blogName").val() == "" || $('#blogEmail').val() == "" || $('#blogComment').val() == "" || $('#blog-form input[name="recaptcha"]').val() == "") {
            $('#errorBlog').css("display", "inline-block");
        } else {
            var data = $(this).serializeArray();
            var form = $(this);
            $.ajax({
                dataType: 'json',
                type: 'POST',
                url: GP_WEBSITES_API_URL + "/api/blog/post-comment/",
                headers: {'GP-Host': window.location.hostname},
                data: data,
                success: function (json) {

                    if($("#success-popup").length > 0 ){
                        $("p.dynamic-text").text(blog_popup_success_text);
                        $("#success-popup").modal("show");

                    }else{
                        $("#success-blog").modal("show");
                    }

                    /* APPENDING THE REPLY IF ITS INSERTED */
                    showComment();
                    $("#blogName").val('');
                    $('#blogEmail').val('');
                    $('#blogComment').val('');
                },
                error: function (json) {
                    if(json.responseJSON.message == 'failed, duplicate entry'){
                        $(".err-text").text('You have already posted the comment!');
                        $("#error-blog").modal("show");
                    }

                }
            });
        }

    });

    /* FUNCTION TO ADD REPLY INSIDE THE DIV */
    function showComment() {
        var newDate = new Date();
        var blogName = $("#blogName").val();
        var comment = $("#blogComment").val();
        var email = $("#blogEmail").val();
        json = {
            blogName: blogName,
            comment: comment,
            date: newDate.toDateString()
        }
        console.log("check json :", json);
        var element = "<div class='col-md-6'>"
        element += "<div class='blog-content'>"
        element += "<div class='parag'>"
        element += "<div class='read-more'>" + json.comment + "</div>"
        if(json.comment.length > 150){
            element += "<a data-toggle=modal data-target=#view-blog class='more'>more <i class='fa fa-angle-right'></i></a>"
        }
        element += "</div>"
        element += "<div class='clearfix'></div>"
        element += "<div class='blog-data'><h3 class='blogName'>" + json.blogName + "</h3>"
        element += "<label class='date'>" + json.date + "</label></div></div></div>";
        console.log("get value : ", element)
        if (comment != "" && blogName != "" && email != "") {
            $("#blogPost").append(element);
        } else {
            $('#errorBlog').css("display", "inline-block");
        }
    }

    /*Blog Content Page*/
// $("#submitBlog").click(function(){
    // var newDate = new Date();
    // var blogName = $("#blogName").val();
    // var comment = $("#blogComment").val();
    // var email = $("#blogEmail").val();
    // json = {
    //    blogName : blogName,
    //    comment : comment,
    //    date : newDate.toDateString()
    //  }
    //  console.log("check json :", json);
    // var element = "<div class='col-md-6'>"+
    //                   "<div class='blog-content'>"+
    //                       "<div class='parag'>"+
    //                           "<div class='read-more'>"+ json.comment +"</div>"+
    //                           "<a data-toggle=modal data-target=#view-blog class='more'>more <i class='fa fa-angle-right'></i></a>"+
    //                       "</div>"+
    //                       "<div class='clearfix'></div>"+
    //                       "<div class='blog-data'><h3 class='blogName'>"+ json.blogName +"</h3>"+
    //                       "<label class='date'>"+ json.date +"</label></div></div></div>";
    // console.log("get value : ", element)
    // if(comment != "" && blogName != "" && email != ""){
    //     $("#blogPost").append(element);
    // }else{
    //     $('#errorBlog').css("display", "inline-block");
    // }
//   })

    var getData = $("#blog-box .read-more");
    var getMore = $("#blog-box .more");
    for (var i = 0; i < getData.length; i++) {
        if (getData[i].innerText.length < 195) {
            getMore[i].style.display = "none";
        }
    }

    $("body").on('click', '.more', function (e) {
        e.preventDefault();
        var getHtml = $(this).parent().parent().find(".blog-data").html();
        var getText = $(this).parent().find(".read-more").text();
        console.log("get data :", getHtml)
        console.log("get get Text :", getText)
        $("#view-blog .blog-attr").html(getHtml);
        $("#view-blog .blog-text").text(getText);
    });
});

