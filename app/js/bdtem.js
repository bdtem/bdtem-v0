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

bdtem.controller('DonateCtrl', function ($scope) {
});

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


bdtem.controller('OrbCtrl', function ($scope, stateService) {

    $scope.startVideo = function () {
        stateService.go('grave');
    }

});

bdtem.controller('ButtonsCtrl', function ($scope, $uibModal) {

    $scope.buttons = [
        {
            purpose: 'Contribute',
            glyph: '\ue803',
            tooltip: 'contribute',
            action: function () {
                $uibModal.open({
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
                $uibModal.open({
                    templateUrl: 'templates/newsletter.html',
                    size: 'med'
                });
            }
        }
    ];

});

bdtem.controller('MiddleCtrl',
    function ($scope, stateService, playerService, videoService, AlbumTracks, StoryEpisodes) {
        $scope.tracks = AlbumTracks;
        $scope.episodes = StoryEpisodes;


        //$scope.buttons = [
        //    {
        //        purpose: 'Contribute',
        //        glyph: '\ue803',
        //        tooltip: 'contribute',
        //        action: function () {
        //            $uibModal.open({
        //                templateUrl: 'templates/donate.html',
        //                controller: 'DonateCtrl',
        //                size: 'med'
        //            });
        //        }
        //    },
        //    {
        //        purpose: 'Archive Updates',
        //        glyph: '\ue805',
        //        tooltip: 'updates',
        //        action: function () {
        //            $uibModal.open({
        //                templateUrl: 'templates/newsletter.html',
        //                size: 'med'
        //            });
        //        }
        //    }
        //];


        $scope.goTo = function goTo(state) {
            stateService.go(state);
        };

        $scope.skipToTrack = function (index) {
            videoService.pause();

            playerService.skipToTrack(index);
        };

        $scope.skipToEpisode = function (episodeIndex) {
            videoService.pause();

            playerService.skipToEpisode(episodeIndex);
        };
    });
