'use strict';

bdtem.service('videoService', function () {
    var videoAPI;

    var PLAY = "play";
    var PAUSE = "pause";
    var STOP = "stop";

    return {
        isPlaying: function () {
            return (videoAPI && videoAPI.currentState === PLAY);
        },
        pause: function () {
            if (this.isPlaying()) {
                videoAPI.pause();
            }
        },
        getVideoAPI: function () {
            return videoAPI;
        },
        setVideoAPI: function (API) {
            videoAPI = API;
        }
    };
});
