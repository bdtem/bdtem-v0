var bdtem = angular.module('bdtem', ['bdtemFilters', 'mediaPlayer']);

bdtem.controller('PlaylistCtrl', function ($scope) {


    var audioFormat = 'audio/mpeg';

    $scope.songs = [
        { src: '../audio/01_Funeral_March.mp3', type: audioFormat},
        { src: '../audio/02_Hesitating_Sun.mp3', type: audioFormat},
        { src: '../audio/03_Future_Is_Bleaker.mp3', type: audioFormat},
        { src: '../audio/04_Sad_to_Feel.mp3', type: audioFormat},
        { src: '../audio/05_2-D.mp3', type: audioFormat},
        { src: '../audio/06_Digging_Out.mp3', type: audioFormat},
        { src: '../audio/07_The_Debate_1.mp3', type: audioFormat},
        { src: '../audio/08_Too_Late_3.mp3', type: audioFormat},
        { src: '../audio/09_Tried_to_Be.mp3', type: audioFormat},
        { src: '../audio/10_Too_Late_2.mp3', type: audioFormat},
        { src: '../audio/11_She_Loves.mp3', type: audioFormat},
        { src: '../audio/12_Every_Sound_in_a_Row.mp3', type: audioFormat},
        { src: '../audio/13_Ha_Na.mp3', type: audioFormat}
    ];

    $scope.titles = [
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

    $scope.metadata = $scope.titles.map(function(datString) {
        var metadata = datString + " is a pretty cool track.";
        console.log(metadata);
        return  metadata;
    });

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
        var clickOffset = event.layerX | event.clientX;
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


    var refreshMetadata = function () {
        var popoverContent = $('.popover-content');
        var popoverTitle = $('.popover-title');

        var currentTrackNumber = $scope.bdtemplayer.currentTrack;

        var currentTitle = $scope.titles[currentTrackNumber].toUpperCase();
        var currentMetadata = $scope.metadata[currentTrackNumber].toUpperCase();

        popoverContent.attr('title', currentTitle);
        popoverContent.attr('data-title', currentTitle);
        popoverContent.attr('data-content', currentMetadata);
        popoverContent.html(currentMetadata);
        popoverTitle.html(currentTitle);
    };

    $scope.prev = function () {
        $scope.bdtemplayer.prev();
        refreshMetadata();
    };

    $scope.next = function () {
        $scope.bdtemplayer.next();
        refreshMetadata();
    };

    $scope.mySpecialPlayButton = function () {
        $scope.bdtemplayer.playPause();
    };

});