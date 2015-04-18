    var bdtem = angular.module('bdtem', [
    'bdtemFilters',
    'mediaPlayer',
    'cfp.hotkeys',
    'ui.bootstrap',
    "ngSanitize",
    "ui.router",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls"
]);



 bdtem.config(['$stateProvider', '$urlRouterProvider',
     function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('orb', {
                url: "/",
                templateUrl: "templates/orb.html"
            })
            .state('video', {
                url: "/",
                templateUrl: "templates/video.html"
            })
            .state('metadata', {
                url: "/",
                templateUrl: "templates/metadata.html",
                controller: 'MetadataCtrl'
            });
    }]);

bdtem.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);

// update popover template for binding unsafe html
angular.module("template/popover/popover.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/popover/popover.html",
            "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
            "  <div class=\"arrow\"></div>\n" +
            "\n" +
            "  <div class=\"popover-inner\">\n" +
            "      <h3 class=\"popover-title\" ng-bind-html=\"title | unsafe\" ng-show=\"title\"></h3>\n" +
            "      <div class=\"popover-content\" ng-bind-html=\"content | unsafe\"></div>\n" +
            "  </div>\n" +
            "</div>\n" +
            "");
}]);

bdtem.service('playerService', function ($rootScope, AlbumTracks, StoryEpisodes) {
    const ALBUM = "ALBUM";
    const STORY = "STORY";

    const ID_WILDCARD = "bdtem-track";

    var bdtemplayer;
    var PLAYING = ALBUM;

    var tracks = {
        "ALBUM": AlbumTracks,
        "STORY": StoryEpisodes
    };

    return {
        playAlbum: function() {
            PLAYING = ALBUM;
        },
        playStory: function () {
            PLAYING = STORY;
        },
        getPlayer: function () {
            return bdtemplayer;
        },
        setPlayer: function (player) {
            bdtemplayer = player;
        },
        getMetadata: function() {

        },

        setTrackHighlighting: function (trackToHighlight) {
            var highlightedTrackId = ID_WILDCARD + trackToHighlight;

            var $tracks = $(".track-menu-entry");

            $tracks.each(function () {
                var trackName = $(this);
                /*TODO (ABL): Kludge: Should not be using hardcoded value.*/
                trackName.css({color: (this.id === highlightedTrackId) ? randomColor() : "#000000"});
            });
        },
        skipToTrack: function (index) {

            //Because angular media player is dumb and 1-based. Remove this correction after changing to videogular.
            bdtemplayer.play(index, true);


            bdtemplayer.load(true);
            $rootScope.$broadcast('trackChange', index);

            this.setTrackHighlighting(index);
        }
    }
});

bdtem.service('videoService', function () {
    var videoAPI;

    const PLAY = "play";
    const PAUSE = "pause";
    const STOP = "stop";

    return {
        pause: function () {
            if (videoAPI) {
                videoAPI.pause();
            }
        },
        getVideoAPI: function () {
            return videoAPI;
        },
        setVideoAPI: function (API) {
            videoAPI = API;
        },
        isPlaying: function () {
            return (videoAPI && videoAPI.currentState === PLAY);
        }
    };
});

bdtem.controller("OrbCtrl", function($scope, $state) {

    $scope.startVideo = function () {
        $state.go("video");
    }

});

bdtem.controller('ButtonsCtrl', function ($scope, $modal) {

    $scope.buttons = [
        {
            purpose: 'Contribute',
            glyph: '\ue803',
            tooltip: 'contribute',
            action: function () {
                $modal.open({
                    templateUrl: 'templates/donate.html',
                    controller: 'DonateCtrl',
                    size: 'med'
                });
            }
        },
        {
            purpose: 'Archive Updates',
            glyph: '\ue805',
            tooltip: 'updates',
            action: function () {
                $modal.open({
                    templateUrl: 'templates/newsletter.html',
                    size: 'med'
                });
            }
        }
    ];

});

bdtem.controller('DonateCtrl', function ($scope) {
});


bdtem.controller('ShareCtrl', function ($scope) {

    $scope.socialMediaBullshit = [
        {
            shareName: 'facebook',
            shareLink: 'http://www.facebook.com/sharer.php?u=http://www.bdtem.co.in',
            shareText: 'FACE'
        },
        {
            shareName: 'twitter',
            shareLink: 'http://twitter.com/share?text=I%20am%20posting%20this%20because%20I%20do%20not%20know%20what%20it%20is.%20&url=http://www.bdtem.co.in',
            shareText: 'TWIT'
        }
    ];

});


function randomColor () {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}



bdtem.controller('MiddleCtrl', function ($scope, playerService, videoService, AlbumTracks, StoryEpisodes) {
    $scope.tracks = AlbumTracks;
    $scope.episodes = StoryEpisodes;

    $scope.skipToTrack = function (index) {
        videoService.pause();

        playerService.skipToTrack(index);
    };

    $scope.skipToEpisode = function (episodeIndex) {

    };


});
