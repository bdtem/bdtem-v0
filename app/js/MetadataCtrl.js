'use strict';

bdtem.controller("MetadataCtrl", function MetadataCtrl($scope, $sce, AlbumTracks, StoryEpisodes, playerService, $timeout) {
  var tracks = {
    "ALBUM": AlbumTracks,
    "STORY": StoryEpisodes
  };

  var player = playerService.getPlayer();

  $scope.metadata = {
    title: "",
    catalog: "",
    description: "" +
    "<div class='centered' style='text-align: center; align-content: center'>" +
    "IF ALL THAT WAS SAID<br/>" +
    "<i>ABOUT THOSE WHO ARE DEAD</i><br/>" +
    "WAS COMPILED IN A BOOK<br/>" +
    "AND LEFT IN A NOOK<br/>" +
    "I'D BE HAPPY TO READ<br/>" +
    "OF HARROWING DEEDS<br/>" +
    "<i>BUT I'D LIKE NOT TO KNOW THE ENDING</i><br/>" +
    "</div>"
  };


  $scope.isOverflow = function () {
    var container = document.getElementById("metadataContainer");
    var content = document.getElementById("metadataContent");

    var containerHeight = container.scrollHeight;
    var contentHeight = content.clientHeight;

    return container && content && contentHeight >= containerHeight;
  };


  $scope.hasDuration = function () {
    return $scope.duration && $scope.duration > 0;
  };

  function setDuration(duration) {
    $scope.duration = duration;
  }


  function setMetadata(track) {
    $scope.metadata = tracks[playerService.currentlyPlaying()][track];
    var duration = player.totalTime | 0;
    $timeout(function () {
      setDuration(duration)
    }, 400);
  }

  function getCurrentTime() {
    return player ? (player.currentTime | 0) : 0;
  }

  $scope.$on('trackChange', function (event, track) {
    setMetadata(track)
  });

  $scope.__defineGetter__('currentTime', getCurrentTime);
});
