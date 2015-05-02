'use strict';

bdtem.service('videoService', function () {
    var videoAPI;

    var PLAY = "play";
    var PAUSE = "pause";
    var STOP = "stop";

    return {
        pause: function () {
            if (videoAPI) {
                videoAPI.pause();
            }
        },
        getVideoAPI: function () {
            return videoAPI;
        },
        setVideoAPI: function (API) {
            videoAPI = API;
        },
        isPlaying: function () {
            return (videoAPI && videoAPI.currentState === PLAY);
        }
    };
});
