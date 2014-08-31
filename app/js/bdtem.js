var bdtem = angular.module('bdtem', ['mediaPlayer']);

bdtem.controller('PlaylistCtrl', function($scope) {

    $scope.songs = [
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

    $scope.cleanDuration = function(seconds) {

        return seconds;
    };

    $scope.test = function() {
        return "HI I AM A VALUE";
    };

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


    console.log($scope.songs);

    $scope.mySpecialPlayButton = function () {
        $scope.customText = 'I started angular-media-player with a custom defined action!';
        $scope.bdtemplayer.playPause();
        console.log($scope.customText);
    };

    console.log($scope.mySpecialPlayButton);

});