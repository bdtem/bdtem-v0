var bdtem = angular.module('bdtem', ['mediaPlayer']);

bdtem.controller('PlaylistCtrl', function ($scope) {

    this.songs = [
        { src: '../audio/01_Funeral_March.mp3', type: 'audio/mpeg'},
        { src: '../audio/02_Hesitating_Sun.mp3', type: 'audio/mpeg'},
        { src: '../audio/03_Future_Is_Bleaker.mp3', type: 'audio/mpeg'},
        { src: '../audio/04_Sad_to_Feel.mp3', type: 'audio/mpeg'},
        { src: '../audio/05_2-D.mp3', type: 'audio/mpeg'},
        { src: '../audio/06_Digging_Out.mp3', type: 'audio/mpeg'},
        { src: '../audio/07_The_Debate_1.mp3', type: 'audio/mpeg'},
        { src: '../audio/08_Too_Late_3.mp3', type: 'audio/mpeg'},
        { src: '../audio/09_Tried_to_Be.mp3', type: 'audio/mpeg'},
        { src: '../audio/10_Too_Late_2.mp3', type: 'audio/mpeg'},
        { src: '../audio/11_She_Loves.mp3', type: 'audio/mpeg'},
        { src: '../audio/12_Every_Sound_in_a_Row.mp3', type: 'audio/mpeg'},
        { src: '../audio/13_Ha_Na.mp3', type: 'audio/mpeg'}
    ];

    this.titles = [
        "",
        "Funeral March",
        "Hesitating Sun",
        "Future Is Bleaker",
        "Sad to Feel",
        "2-D",
        "Digging Out",
        "The Debate 1",
        "Too Late 3",
        "Tried to Be",
        "Too Late 2",
        "She Loves",
        "Every Sound in a Row",
        "Ha Na"
    ];

    this.isPlaying = function () {
        return $scope.bdtemplayer.isPlaying;
    };

    this.currentTime = 0;

    var getCurrentTime = function () {
        return $scope.bdtemplayer.currentTime | 0;
    };

    $scope.seekFromProgressBar = function(event) {
        var srcElement = event.srcElement;
        var sourceElement = srcElement ? srcElement : event.target;
        var maxInDuration = $scope.bdtemplayer.duration;
        var pxWidth = sourceElement.offsetWidth;
        var xOffset = sourceElement.offsetParent.offsetLeft;
        var clickOffset = event.layerX;
        var pixelsRight = Math.abs(xOffset - clickOffset);

        var percentage = pixelsRight / pxWidth;
        var whereToSeekInDuration = Math.floor(percentage * maxInDuration);

        $scope.bdtemplayer.seek(whereToSeekInDuration);
    };

    this.seekTo = function (whereToSeek) {
        $scope.bdtemplayer.seek(whereToSeek | 0);
    };

    this.__defineGetter__("currentTime", getCurrentTime);


    this.__defineSetter__("currentTime", this.seekTo);

    $scope.prev = function () {
        $scope.bdtemplayer.prev();
    };

    $scope.next = function () {
        $scope.bdtemplayer.next();
    };

    $scope.mySpecialPlayButton = function () {
        $scope.bdtemplayer.playPause();
    };

    $scope.metadataPopover = function () {
        console.log("I would like to pop over some data :D");
    }

});