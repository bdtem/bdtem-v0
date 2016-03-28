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


bdtem.controller('OrbCtrl', function ($scope, stateService) {
    $scope.startVideo = function () {
        stateService.go('video');
    }
});


bdtem.controller('AlbumCtrl',
    function (playerService, videoService, AlbumTracks) {
        var controller = this;

        controller.tracks = AlbumTracks;

        controller.skipToTrack = function (index) {
            videoService.pause();

            playerService.skipToTrack(index);
        };

    });

bdtem.controller('MenuCtrl',
    function ($uibModal, stateService) {
        var controller = this;

        controller.entries = [
            {
                purpose: "Needs more buttons!",
                action: function () {
                    stateService.go('grave');
                }
            },
            {
                purpose: "Mission Control",
                action: function () {
                    stateService.go('mission');
                }
            },
            {
                purpose: 'Contribute',
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
                action: function () {
                    $uibModal.open({
                        templateUrl: 'templates/newsletter.html',
                        size: 'med'
                    });
                }
            }, {
                purpose: 'Info Page',
                action: function () {
                    stateService.go('info')
                }
            }
        ];

    });
