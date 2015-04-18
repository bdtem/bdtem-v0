'use strict';

var bdtem = angular.module('bdtem', [
    'bdtemFilters',
    'cfp.hotkeys',
    'ui.bootstrap',
    "ngSanitize",
    "ui.router",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls"
]);

bdtem.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

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

bdtem.controller("OrbCtrl", function ($scope, $state) {

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

bdtem.controller('MiddleCtrl', function ($scope, playerService, videoService, AlbumTracks, StoryEpisodes) {
    $scope.tracks = AlbumTracks;
    $scope.episodes = StoryEpisodes;

    $scope.skipToTrack = function (index) {
        videoService.pause();

        playerService.skipToTrack(index);
    };

    $scope.skipToEpisode = function (episodeIndex) {
        videoService.pause();

        playerService.skipToEpisode(episodeIndex);
    };
});
