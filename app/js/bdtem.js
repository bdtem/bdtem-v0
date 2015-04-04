var bdtem = angular.module('bdtem', [
    'bdtemFilters',
    'mediaPlayer',
    'cfp.hotkeys',
    'ui.bootstrap',
    "ngSanitize",
    "ui.router",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster"
]);



 bdtem.config(['$stateProvider', '$urlRouterProvider',
     function($stateProvider, $urlRouterProvider) {

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('video', {
                url: "/",
                templateUrl: "templates/video.html"
            })
            .state('metadata', {
                url: "/",
                templateUrl: "templates/app.html",
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

bdtem.service('playerService', function ($rootScope) {
    var bdtemplayer;

    var idWildcard = "bdtem-track";

    return {
        getPlayer: function () {
            return bdtemplayer;
        },
        setPlayer: function (player) {
            bdtemplayer = player;
        },
        setTrackHighlighting: function (trackToHighlight) {

            var highlightedTrackId = idWildcard + trackToHighlight;

            var $tracks = $(".track-menu-entry");

            var generatedColor = randomColor();

            $tracks.each(function () {
                var trackName = $(this);
                var id = this.id === highlightedTrackId;

                /*TODO (ABL): Kludge: Should not be using hardcoded value.*/
                trackName.css({color: id ? generatedColor : "#000000"});
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

bdtem.controller('ButtonsCtrl', function ($scope, $modal) {

    $scope.buttons = [
        {
            purpose: 'Contribute',
            glyph: '\ue803',
            tooltip: 'Contribute',
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
            tooltip: 'Archive Updates',
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


bdtem.controller('VideoCtrl', function ($scope, $sce, playerService, videoService) {

    var controller = this;
    controller.API = null;

    controller.onPlayerReady = function (API) {
        controller.API = API;
        videoService.setVideoAPI(API);
    };

    $scope.customClickOverlayPlay = function () {
        playerService.getPlayer().pause();
        controller.API.playPause();
    };

    controller.config = {
        sources: [
            {src: $sce.trustAsResourceUrl("../video/about.mp4"), type: "video/mp4"}
        ],
        tracks: [
            {
            }
        ],
        theme: "styles/videogular.css",
        plugins: {
            poster: "http://couleurs.na.tl/rick/spriteSheet77.png"
        }
    };


});

bdtem.controller('MiddleCtrl', function ($scope, playerService, videoService, Metadata) {

    $scope.tracks = Metadata;

    $scope.skipToTrack = function (index) {
        videoService.getVideoAPI().pause();


        console.log("skip to " + index)
        playerService.skipToTrack(index);
    };

});


 bdtem.controller("MetadataCtrl", function MetadataCtrl($scope, $sce, Metadata, playerService, $timeout) {
     var player = playerService.getPlayer();
     setMetadata(0);

     function setMetadata(track) {
        $scope.metadata = Metadata[track];

        $timeout(function () {$scope.duration = player.duration | 0}, 99);
    }

     function getCurrentTime() {
         return player ? (player.currentTime | 0) : 0;
     }

     $scope.$on('trackChange', function(event, track) {setMetadata(track)});

     $scope.__defineGetter__('currentTime', getCurrentTime);
 });