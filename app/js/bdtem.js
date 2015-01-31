const __HOST__ = '127.0.0.1';

var bdtem = angular.module('bdtem', [
    'bdtemFilters',
    'mediaPlayer',
    'cfp.hotkeys',
    'ui.bootstrap',
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster"
]);

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

bdtem.service('playerService', function () {
    var bdtemplayer;

    var idWildcard = "bdtem-track";

    return {
        getPlayer: function () {
            return bdtemplayer;
        },
        setPlayer: function (player) {
            bdtemplayer = player;
        },
        setTrackHighlighting: function () {
            var trackToHighlight = bdtemplayer.currentTrack;

            var highlightedTrackId = idWildcard + trackToHighlight;

            var $tracks = $("[id^=" + idWildcard + "]");

            var generatedColor = randomColor();

            $tracks.each(function () {
                var trackName = $(this);
                var id = this.id;

                /*TODO (ABL): Kludge: Should not be using hardcoded value.*/
                trackName.css({color: id === highlightedTrackId ? generatedColor : "#F0F0F0"});
            });
        },
        skipToTrack: function (index) {
            bdtemplayer.play(index, true);
            bdtemplayer.load(true);
            this.setTrackHighlighting();
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
            purpose: 'Share',
            glyph: '\ue808',
            tooltip: 'SHARE',
            action: function () {
                $modal.open({
                    templateUrl: "templates/share.html",
                    size: 'med'
                });
            }
        },
        {
            purpose: 'Donate',
            glyph: '\ue803',
            tooltip: 'DONATE',
            action: function () {
                $modal.open({
                    templateUrl: 'templates/donate.html',
                    controller: 'DonateCtrl',
                    size: 'med'
                });
            }
        },
        {
            purpose: 'Newsletter',
            glyph: '\ue805',
            tooltip: 'NEWS',
            action: function () {
                $modal.open({
                    templateUrl: 'templates/newsletter.html',
                    size: 'med'
                });
            }
        },
        {
            purpose: 'Contact',
            glyph: '\ue800',
            tooltip: 'CONTACT',
            action: function () {
                $modal.open({
                    templateUrl: 'templates/contact.html',
                    controller: 'ContactCtrl',
                    size: 'med'
                });
            }
        }
    ];

});

bdtem.controller('DonateCtrl', function ($scope) {
});


bdtem.factory('postContactForm', ['$http', function ($http) {
    return {
        postContact: function (contactData, callback) {
            $http.post('/contact', contactData).success(callback);
        }
    }
}]);

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

bdtem.controller('ContactCtrl', function ($scope, $http) {

    $scope.submitContact = function (contact) {
        $http.post('http://' + __HOST__ + ':3000/contact', contact)
            .success(function (data, status, headers, config) {
                console.log('------SUCCESS! :DD --------');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);

            }).
            error(function (data, status, headers, config) {
                console.log('------- FAILURE :CCCC --------');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });

    };

});

var randomColor = function () {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
};


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

bdtem.controller('MiddleCtrl', function ($scope, playerService, videoService) {

    $scope.skipToTrack = function (index) {
        videoService.getVideoAPI().pause();
        playerService.skipToTrack(index);
    };

});