var bdtem = angular.module('bdtem', ['bdtemFilters', 'mediaPlayer']);

bdtem.controller('PlaylistCtrl', function ($scope) {


    $scope.songs = [
        { src: '../audio/01_Funeral_March.mp3', type: 'audio/mpeg'},
        { src: '../audio/02_Hesitating_Sun.mp3', type: 'audio/mpeg'},
        { src: '../audio/03_Future_Is_Bleaker.mp3', type: 'audio/mpeg'},
        { src: '../audio/04_Sad_to_Feel_the_Same.mp3', type: 'audio/mpeg'},
        { src: '../audio/05_Sit_on_a_Dream.mp3', type: 'audio/mpeg'},
        { src: '../audio/06_Digging_Out.mp3', type: 'audio/mpeg'},
        { src: '../audio/07_The_Debate.mp3', type: 'audio/mpeg'},
        { src: '../audio/08_Working_at_First.mp3', type: 'audio/mpeg'},
        { src: '../audio/09_Tried_to_Be.mp3', type: 'audio/mpeg'},
        { src: '../audio/10_The_Basement.mp3', type: 'audio/mpeg'},
        { src: '../audio/11_One_Level_at_a_Time.mp3', type: 'audio/mpeg'},
        { src: '../audio/12_Every_Sound_in_a_Row.mp3', type: 'audio/mpeg'},
        { src: '../audio/13_The_End.mp3', type: 'audio/mpeg'}
    ];

    $scope.titles = [
        "",
        "Funeral March",
        "Hesitating Sun",
        "Future Is Bleaker",
        "Sad to Feel the Same",
        "Sit on a Dream",
        "Digging Out",
        "The Debate",
        "Working at First",
        "Tried to Be",
        "The Basement",
        "One Level at a Time",
        "Every Sound in a Row",
        "The End"
    ];

    $scope.metadata = $scope.titles.map(function (datString) {
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

    $scope.seekFromProgressBar = function (event) {
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

    $scope.skipToTrack = function ( index ) {
        $scope.bdtemplayer.play( index, true );
    }

});