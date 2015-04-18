'use strict';

bdtem.service('videoService', function () {
    var videoAPI;

    const PLAY = "play";
    const PAUSE = "pause";
    const STOP = "stop";

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
