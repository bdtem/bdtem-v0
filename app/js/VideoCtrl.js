/**
 * Created by abl on 4/6/15.
 */
bdtem.controller('VideoCtrl', function ($scope, $sce, playerService, videoService) {

    var controller = this;
    controller.API = null;

    controller.onPlayerReady = function (API, $scope) {
        controller.API = API;
        videoService.setVideoAPI(API);
    };

    controller.onPlayerStateChange = function ($state) {

        console.log('test');

        if($state === "play") {
                playerService.getPlayer().pause();
            }
    };


    controller.onError = function ($error) {

        console.log($error);

    };

    controller.config = {
        sources: [
            {src: $sce.trustAsResourceUrl("video/about.mp4"), type: "video/mp4"}
        ],
        theme: {
            url: "bower_components/videogular-themes-default/videogular.min.css"
        }
    };


});