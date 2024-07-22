$(".hamburger").on("click", function () {
  $(header).toggleClass("builder-dynamic-open");
});

var nav = $(".header");
nav.find("li>a").on("click", function (e) {
  if ($(this).closest("li").children("ul").length && $(window).width() < 767) {
    e.preventDefault();
  }
  var $this = $(this);
  var $li = $this.parent();

  //set active state to clicked menu item:
  $li
    .addClass("builder-dynamic-active")
    .siblings()
    .removeClass("builder-dynamic-active builder-dynamic-open");

  //look if there is a UL after the A, if so it contains submenu:
  if ($this.next().is("ul")) {
    $li.toggleClass("builder-dynamic-open");
  }
});

$(window).on("scroll", function () {
  var scroll = $(window).scrollTop();

  if (scroll >= 200) {
    $("#header").addClass("builder-dynamic-fixed");
  } else {
    $("#header").removeClass("builder-dynamic-fixed");
  }
});
