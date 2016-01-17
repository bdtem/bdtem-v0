/**
 * Created by abl on 4/6/15.
 */
'use strict';

bdtem.controller('VideoCtrl', function ($scope, $sce, playerService, videoService, stateService, $timeout) {

    var controller = this;
    controller.API = null;

    controller.closeVideo = function () {
        stateService.toggleTo('orb');
    };

    var playButton;

    controller.onPlayerReady = function (API) {

        controller.API = API;
        videoService.setVideoAPI(API);
        $timeout(function playWithDelay() {API.playPause()}, 250);
    };

    controller.onPlayerStateChange = function ($state) {
        playButton = document.getElementById("videoPlay");
        if(playButton) {
            playButton.children[0].setAttribute("onfocus", "this.blur()");
        }

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
            url: "styles/videogular.css"
        },
        plugins: {
            controls: {
                autoHide: true,
                autoHideTime: 2000
            }
        }
    };

});
