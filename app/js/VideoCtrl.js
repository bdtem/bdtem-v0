/**
 * Created by abl on 4/6/15.
 */
bdtem.controller('VideoCtrl', function ($scope, $sce, playerService, videoService, $state) {

    var controller = this;
    controller.API = null;

    controller.closeVideo = function () {
        $state.go('orb');
    };

    controller.onPlayerReady = function (API) {
        controller.API = API;
        videoService.setVideoAPI(API);
    };

    controller.onPlayerStateChange = function ($state) {
        if ($state === "play") {
            playerService.getPlayer().pause();
        }
    };

    controller.config = {
        sources: [
            {src: $sce.trustAsResourceUrl("../video/about.mp4"), type: "video/mp4"}
        ],
        tracks: [
            {
            }
        ],
        theme: {
            url: "bower_components/videogular-themes-default/videogular.min.css"
        },
        plugins: {
            controls: {
                autoHide: true,
                autoHideTime: 3000
            }
        }
    };

});
