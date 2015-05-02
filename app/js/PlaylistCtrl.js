'use strict';

bdtem.controller('PlaylistCtrl', ['AlbumTracks', 'StoryEpisodes', '$rootScope', '$scope', '$filter', 'hotkeys', '$sce', '$location', 'playerService', 'videoService', '$timeout', '$state',
    function PlaylistCtrl(AlbumTracks, StoryEpisodes, $rootScope, $scope, $filter, hotkeys, $sce, $location, playerService, videoService, $timeout, $state) {

        var controller = this;
        var player;
        var wasPlayed = false;
        var currentTrack = 0;

        var volume = 1;
        $scope.showVolumeBar = false;


        function trustAsResource(track) {
            track.src = $sce.trustAsResourceUrl(track.src);
            return track;
        }


        var tracks = {
            "ALBUM": AlbumTracks.map(trustAsResource),
            "STORY": StoryEpisodes.map(trustAsResource)
        };
        var PLAYING = "ALBUM";


        controller.config = {
            sources: [
                tracks[PLAYING][currentTrack]
            ],
            tracks: [
                {
                }
            ],
            theme: {
                url: "bower_components/videogular-themes-default/videogular.css"
            }
        };


        controller.onPlayerReady = function ($API) {
            player = $API;
            volume = player.volume;
            playerService.setPlayer(player);
        };

        controller.onChangeSource = function (newValue) {
        };

        controller.onTrackComplete = function () {
            controller.nextTrack();
        };

        controller.onPlayerStateChange = function (newState) {
            var isPlaying = newState === 'play';
            if (isPlaying) {


                if (!wasPlayed && !controller.isPlaying()) {
                    wasPlayed = true;
                    $.sidr("open", "tracks-menu");

                    playerService.setTrackHighlighting(currentTrack)
                }

                if (videoService.isPlaying()) {
                    videoService.getVideoAPI().pause();
                }

            }
        };

        $scope.$on('trackChange', function changePlayerTrack(event, track) {
            var currentTracks = tracks[PLAYING];
            if (track < 0 || track > currentTracks.length) {
                return;
            }

            player.stop();
            currentTrack = track;

            controller.config.sources = [currentTracks[track]];

            $timeout(player.play.bind(player), 100);

            playerService.setTrackHighlighting(track);
        });

        $scope.$on('tracklistChange', function changePlayerTracklist(event, changeEvent) {
            var tracklistName = changeEvent["trackList"];

            var newTracklist = tracks[tracklistName];

            if (newTracklist) {
                PLAYING = tracklistName;
                skipTo(changeEvent["index"])
            }
        });

        function getTrackFromQPs() {
            var track = parseInt($location.search()['track']);

            if (track > 0 && track < $scope.songs.length) {
                $timeout(function () {
                    playerService.skipToTrack(track)
                });
            }
        }


        $scope.toggleVolumeBar = function () {
            $scope.showVolumeBar = !$scope.showVolumeBar;

            if ($scope.showVolumeBar) {
                positionTheVolumeBar();
            }
        };

        $scope.$watch('volume', function (newValue) {
            if (player && newValue && !isNaN(newValue)) {
                player.setVolume(newValue);
            }
        });


        $scope.__defineGetter__('player', function () {
            return player | setPlayer();
        });


        controller.isPlaying = function () {
            return player && player.currentState === "play";
        };

//        controller.isPlaying = function (index) {
//            return player && index === player.currentTrack;
//        };


        $scope.seekFromProgressBar = function (event) {
            var srcElement = event.srcElement;
            var sourceElement = srcElement ? srcElement : event.target;

            var offsetParent = sourceElement.offsetParent;
            var pxWidth = offsetParent.offsetWidth;
            var xOffset = offsetParent.offsetLeft;
            var clickOffset = event.layerX | event.clientX;
            var pixelsRight = Math.abs(xOffset - clickOffset);

            var percentage = pixelsRight / pxWidth;
            var whereToSeekInDuration = Math.floor(percentage * player.totalTime);

            player.seek(whereToSeekInDuration);
        };

        $scope.seekTo = function (whereToSeek) {
            player.seek(whereToSeek | 0);
        };

        this.seekTo = function (whereToSeek) {
            player.seek(whereToSeek | 0);
        };


        var previousState = null;
        var METADATA = 'metadata';
        $scope.toggleMetadata = function () {

            var currentState = $state.current.name;
            if (currentState === METADATA) {
                $state.go(previousState);
                previousState = null;
            } else {
                previousState = currentState;
                $state.go(METADATA);
            }
        };


        function skipTo(trackIndex) {
            var videoAPI = videoService.getVideoAPI();
            if (videoService.isPlaying()) {
                videoAPI.pause();
            }
            if (trackIndex >= 0 && trackIndex < tracks[PLAYING].length) {
                playerService.skipTo(PLAYING, trackIndex);
            }
        }


        $scope.prevTrack = function () {
            skipTo(currentTrack - 1);
        };

        $scope.nextTrack = function () {
            skipTo(currentTrack + 1);
        };

        hotkeys.bindTo($scope)
            .add({
                combo: 'space',
                description: 'Play / Pause',
                callback: function () {
                    player.playPause();
                }
            }).add({
                combo: 'left',
                description: 'Previous Track',
                callback: function () {
                    $scope.prevTrack();
                }
            }).add({
                combo: 'right',
                description: 'Next Track',
                callback: function () {
                    $scope.nextTrack();
                }
            }).add({
                combo: 'ctrl+left',
                description: 'Seek Back 10 Seconds',
                callback: function () {
                    var whereToSeek = player.currentTime - 10000;
                    $scope.seekTo(whereToSeek);
                }
            }).add({
                combo: 'ctrl+right',
                description: 'Seek Forward 10 Seconds',
                callback: function () {
                    var whereToSeek = player.currentTime + 10000;
                    $scope.seekTo(whereToSeek);
                }
            }).add({
                combo: 'a',
                description: 'Toggle album menu',
                callback: function () {
                    $.sidr('toggle', 'tracks-menu')
                }
            }).add({
                combo: 's',
                description: 'Toggle story menu',
                callback: function () {
                    $.sidr('toggle', 'story-menu')
                }
            }).add({
                combo: 'i',
                description: 'Toggle metadata',
                callback: function () {
                    $scope.toggleMetadata();
                }
            });

    }])
;
