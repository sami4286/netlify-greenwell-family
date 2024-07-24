$(".BannerVolumeButton").on("click", function () {
  var player = $(this).siblings("video")[0];
  if (player.muted == true) {
    player.muted = false;

    $(".BannerVolumeButton").html('<i class="fa fa-volume-up"></i>');
  } else {
    player.muted = true;
    $(".BannerVolumeButton").html('<i class="fa fa-volume-off"></i>');
  }
});
