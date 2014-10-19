var bdtem = angular.module('bdtem', ['bdtemFilters', 'mediaPlayer', 'cfp.hotkeys']);

bdtem.controller('PlaylistCtrl', function ($scope, $filter, hotkeys, $sce) {

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
        var metadata = "This is some metadata for " + datString +". It is a pretty cool track.";
        return  metadata;
    });

    $scope.catalogNumbers = $scope.titles.map(function (element, index) {
        return  'Gr. 2' + ' No. ' + index;
    });

    this.isPlaying = function () {
        return $scope.bdtemplayer.isPlaying;
    };

    var getCurrentTime = function () {
        return $scope.bdtemplayer.currentTime | 0;
    };
    $scope.__defineGetter__('currentTime', getCurrentTime);

    var getDuration = function () {
        return $scope.bdtemplayer.duration | 0;
    };
    $scope.__defineGetter__('currentDuration', getDuration);

    $scope.seekFromProgressBar = function (event) {
        var srcElement = event.srcElement;
        var sourceElement = srcElement ? srcElement : event.target;

        var pxWidth = sourceElement.offsetWidth;
        var xOffset = sourceElement.offsetParent.offsetLeft;
        var clickOffset = event.layerX | event.clientX;
        var pixelsRight = Math.abs(xOffset - clickOffset);

        var percentage = pixelsRight / pxWidth;
        var whereToSeekInDuration = Math.floor(percentage * getDuration());

        $scope.bdtemplayer.seek(whereToSeekInDuration);
    };

    $scope.seekTo = function (whereToSeek) {
        $scope.bdtemplayer.seek(whereToSeek | 0);
    };

    this.seekTo = function (whereToSeek) {
        $scope.bdtemplayer.seek(whereToSeek | 0);
    };

    var getMetadataTitle = function() {
        var currentTrack = $scope.bdtemplayer.currentTrack;
        var titleComponents = [
            $scope.titles[currentTrack],
            '<div class="pull-right">',
            $scope.catalogNumbers[currentTrack],
            '</div>',
            '<br/>',
            $filter('timeFilter')(getCurrentTime()),
            "/",
            $filter('timeFilter')(getDuration())
        ];

        return titleComponents.join(" ");
    };
    $scope.__defineGetter__('metadataTitle', getMetadataTitle);

    $scope.prev = function () {
        $scope.bdtemplayer.prev();
        refreshMetadata();
    };

    $scope.next = function () {
        $scope.bdtemplayer.next();
        refreshMetadata();
    };

    $scope.bdtemPlayPause = function () {
        $scope.bdtemplayer.playPause();
    };

    $scope.skipToTrack = function (index) {
        $scope.bdtemplayer.play(index, true);
        refreshMetadata();
    };

    hotkeys.bindTo($scope)
        .add({
            combo: 'space',
            description: 'Play / Pause',
            callback: function () {
                $scope.bdtemPlayPause();
            }
        }).add({
            combo: 'left',
            description: 'Previous Track',
            callback: function () {
                $scope.prev();
            }
        }).add({
            combo: 'right',
            description: 'Next Track',
            callback: function () {
                $scope.next();
            }
        }).add({
            combo: 'ctrl+left',
            description: 'Seek Back 10 Seconds',
            callback: function () {
                var whereToSeek = getCurrentTime() - 10;
                $scope.seekTo(whereToSeek);
            }
        }).add({
            combo: 'ctrl+right',
            description: 'Seek Forward 10 Seconds',
            callback: function () {
                var whereToSeek = getCurrentTime() + 10;
                $scope.seekTo(whereToSeek);
            }
        });

    $scope.asHtml = function (val) {
        return $sce.trustAsHtml("<i>yeaaah</i>");
    };

    $scope.isSceEnabled = function () {
        return $sce.isEnabled();
    }
});