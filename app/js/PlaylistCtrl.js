bdtem.controller('PlaylistCtrl', ['Metadata', '$rootScope', '$scope', '$filter', 'hotkeys', '$sce', '$location', 'playerService', 'videoService', '$timeout', '$state',
    function PlaylistCtrl(Metadata, $rootScope, $scope, $filter, hotkeys, $sce, $location, playerService, videoService, $timeout, $state) {

        var player;
        var volume = 1;
        $scope.showVolumeBar = false;

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


        $scope.songs = Metadata;
        $scope.metadata = Metadata;


        $scope.__defineGetter__('player', function () {
            return player | setPlayer();
        });

        function setPlayer() {
            var scopePlayer = $scope.bdtemplayer;
            playerService.setPlayer(scopePlayer);
            player = scopePlayer;
            volume = scopePlayer.volume;
            return scopePlayer;
        }

        $(document).ready(function () {
            setPlayer();

            var track = parseInt($location.search()['track']);

            if (track > 0 && track < $scope.songs.length) {
                $timeout(function () {
                    playerService.skipToTrack(track)
                });
            }
        });

        this.isPlaying = function () {
            return player.isPlaying;
        };

        this.isPlaying = function (index) {
            return index === player.currentTrack;
        };


        var getCurrentTime = function () {
            return player ? (player.currentTime | 0) : 0;
        };
        $scope.__defineGetter__('currentTime', getCurrentTime);

        var getDuration = function () {
            return player ? (player.duration | 0) : 0;
        };
        $scope.__defineGetter__('currentDuration', getDuration);

        $scope.seekFromProgressBar = function (event) {
            var srcElement = event.srcElement;
            var sourceElement = srcElement ? srcElement : event.target;

            var offsetParent = sourceElement.offsetParent;
            var pxWidth = offsetParent.offsetWidth;
            var xOffset = offsetParent.offsetLeft;
            var clickOffset = event.layerX | event.clientX;
            var pixelsRight = Math.abs(xOffset - clickOffset);

            var percentage = pixelsRight / pxWidth;
            var whereToSeekInDuration = Math.floor(percentage * getDuration());

            player.seek(whereToSeekInDuration);
        };

        $scope.seekTo = function (whereToSeek) {
            player.seek(whereToSeek | 0);
        };

        this.seekTo = function (whereToSeek) {
            player.seek(whereToSeek | 0);
        };


        var previousState = null;
        const METADATA = 'metadata';

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

        $scope.getMetadataTitle = function () {
            var extractedPlayer;

            if (player) {
                extractedPlayer = player;
            } else {
                extractedPlayer = setPlayer();
            }

            var currentTrack = extractedPlayer.currentTrack | 0;

            var metadata = $scope.metadata[currentTrack];

            if (metadata) {

                var titleComponents = [
                        '<div class="pull-left">' + metadata.title + '</div>',
                        '<div class="pull-right">' + metadata.catalog + '</div>',
                    '<br/>',
                        '<div class="pull-left">' + $filter('timeFilter')(getCurrentTime()),
                    "/",
                        $filter('timeFilter')(getDuration()) + '</div>',
                    '<div class="pull-right button-font unpadded" >\ue808</div>'
                ];

                return titleComponents.join("&nbsp;");
            } else {
                return "";
            }
        };

        $scope.prevTrack = function () {
            var videoAPI = videoService.getVideoAPI();
            if (videoService.isPlaying()) {
                videoAPI.pause();
            }


            //Because angular-media-player is 1 based...
            var previousTrack = player.currentTrack - 2;

            console.log("previous to: " + previousTrack)


            if(previousTrack >= 0) {
                player.prev(true);
                $rootScope.$broadcast('trackChange', previousTrack);
                playerService.setTrackHighlighting(previousTrack);
            }

            console.log("now playing " + player.currentTrack)

        };

        $scope.nextTrack = function () {
            var videoAPI = videoService.getVideoAPI();
            if (videoService.isPlaying()) {
                videoAPI.pause();
            }

            //Because angular-media player is 1 based...
            var nextTrack = player.currentTrack;

            console.log("next track to " + nextTrack)

            if (nextTrack < $scope.songs.length) {
                player.next(true);
                $rootScope.$broadcast('trackChange', nextTrack);
                playerService.setTrackHighlighting(nextTrack);
            }

            console.log("now playing " + player.currentTrack)

        };

        $scope.bdtemPlayPause = function () {

            var videoAPI = videoService.getVideoAPI();

            if (videoService.isPlaying()) {
                videoAPI.pause();
            }

            player.playPause();
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
            }).add({
                combo: 'a',
                description: 'Toggle album menu',
                callback: function () {
                    $.sidr('toggle', 'tracks-menu')
                }
            }).add({
                combo: 'p',
                description: 'Toggle podcast menu',
                callback: function () {
                    $.sidr('toggle', 'podcast-menu')
                }
            }).add({
                combo: 'i',
                description: 'Toggle metadata',
                callback: function () {
                    $scope.toggleMetadata();
                }
            });

    }]);
