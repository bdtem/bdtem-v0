'use strict';

bdtem.controller('PlaylistCtrl',
    [
        'tracklistService',
        '$rootScope',
        '$scope',
        '$filter',
        'hotkeys',
        '$location',
        'playerService',
        'videoService',
        '$timeout',
        'stateService',
        function PlaylistCtrl(tracklistService,
                              $rootScope,
                              $scope,
                              $filter,
                              hotkeys,
                              $location,
                              playerService,
                              videoService,
                              $timeout,
                              stateService) {

            var controller = this;
            var player;
            var wasPlayed = false;
            var currentTrack = 0;

            var volume = 1;
            $scope.showVolumeBar = false;


            controller.config = {
                sources: [
                    tracklistService.getCurrentTrackList()[currentTrack]
                ],
                tracks: [
                    {}
                ],
                theme: {
                    url: "bower_components/videogular-themes-default/videogular.css"
                }
            };


            controller.onPlayerReady = function ($API) {
                player = $API;
                volume = player.volume;
                playerService.setPlayer(player);
                getTrackFromQPs();
            };

            controller.onChangeSource = function (newValue) {
            };

            controller.onTrackComplete = function () {
                $scope.nextTrack();
            };

            controller.onPlayerStateChange = function (newState) {
                var isNowPlaying = newState === 'play';
                if (isNowPlaying) {
                    if (!wasPlayed && !playerService.isPlaying()) {
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
                var currentTracks = tracklistService.getCurrentTrackList();
                if (track < 0 || track > currentTracks.length) {
                    return;
                }

                player.stop();
                currentTrack = track;

                controller.config.sources = [currentTracks[track]];

                $timeout(player.play.bind(player), 100);

                playerService.setTrackHighlighting(track);
            });

            function getTrackFromQPs() {
                var track = parseInt($location.search()['track']) - 1;

                if (track >= 0 && track < tracklistService.getCurrentTrackList().length) {
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


            var METADATA = 'metadata';
            $scope.toggleMetadata = function () {
                stateService.toggleTo(METADATA);
            };

            function skipTo(trackIndex) {
                videoService.pause();
                var trackList = tracklistService.getCurrentTrackList();
                if (trackIndex >= 0 && trackIndex < trackList.length) {
                    playerService.skipTo(trackList, trackIndex);
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

        }
    ]
);
