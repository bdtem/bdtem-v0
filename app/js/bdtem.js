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

    this.isPlaying = function () {
        return $scope.bdtemplayer.isPlaying;
    };


    this.seekTo = function (whereToSeek) {
        whereToSeek = whereToSeek | 0;

        console.log("sup I'm seeking to : " + whereToSeek);

        $scope.bdtemplayer.seek(whereToSeek);
    };

    this.currentTime = 0;

    this.__defineGetter__("currentTime", function () {
        return $scope.bdtemplayer.currentTime | 0;
    });

    this.__defineSetter__("currentTime", this.seekTo);

    this.prev = function () {
        $scope.bdtemplayer.prev();
    };

    this.next = function () {
        $scope.bdtemplayer.next();
    };



    this.cleanDuration = function (seconds) {
        return seconds;
    };

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


    console.log($scope.songs);

    this.mySpecialPlayButton = function () {
        $scope.bdtemplayer.playPause();
    };

    console.log($scope.mySpecialPlayButton);

});