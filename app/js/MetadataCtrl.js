'use strict';

bdtem.controller("MetadataCtrl", function MetadataCtrl($scope, $sce, AlbumTracks, StoryEpisodes, playerService, $timeout) {
    var tracks = {
        "ALBUM": AlbumTracks,
        "STORY": StoryEpisodes
    };

    var player = playerService.getPlayer();
    setMetadata(playerService.getCurrentTrack());


    $scope.isOverflow = function () {
        var container = document.getElementById("metadataContainer");
        var content = document.getElementById("metadataContent");

        var containerHeight = container.scrollHeight;
        var contentHeight = content.clientHeight;

        return container && content && contentHeight >= containerHeight;
    };

    function setMetadata(track) {
        $scope.metadata = tracks[playerService.currentlyPlaying()][track];
        $timeout(function () {
            $scope.duration = player.totalTime | 0
        }, 100);
    }

    function getCurrentTime() {
        return player ? (player.currentTime | 0) : 0;
    }

    $scope.$on('trackChange', function (event, track) {
        setMetadata(track)
    });

    $scope.__defineGetter__('currentTime', getCurrentTime);
});