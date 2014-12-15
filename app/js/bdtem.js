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

    return {
        getPlayer: function () {
            return bdtemplayer;
        },
        setPlayer: function (player) {
            bdtemplayer = player;
        }
    };
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
//        console.log(contact);

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


bdtem.controller('VideoCtrl', function ($scope, $sce, playerService, videoService) {

    var controller = this;
    controller.API = null;

    controller.onPlayerReady = function (API) {
        controller.API = API;
        videoService.setVideoAPI(API);
//        console.log('player ready');
//        console.log(API);
    };

    $scope.customClickOverlayPlay = function () {
//        console.log('overlay play clicked');
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

bdtem.controller('PlaylistCtrl', function ($scope, $filter, hotkeys, $sce, playerService, videoService) {

    var player;
    var volume = 1;

    $scope.showVolumeBar = false;

    $scope.toggleVolumeBar = function () {
        $scope.showVolumeBar = !$scope.showVolumeBar;

        if($scope.showVolumeBar) {
            positionTheVolumeBar();
        }
    };

    $scope.$watch('volume', function (newValue) {
        if (player) {
            player.setVolume(newValue);
        }
    });

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
        console.log('player set');
    });

    $scope.songs = [
        { src: '../audio/01_Funeral_March.mp3', type: 'audio/mpeg'},
        { src: '../audio/02_Hesitating_Sun.mp3', type: 'audio/mpeg'},
        { src: '../audio/03_Future_Is_Bleaker.mp3', type: 'audio/mpeg'},
        { src: '../audio/04_Sad_To_Feel_The_Same.mp3', type: 'audio/mpeg'},
        { src: '../audio/05_Sit_On_A_Dream.mp3', type: 'audio/mpeg'},
        { src: '../audio/06_Digging_Out.mp3', type: 'audio/mpeg'},
        { src: '../audio/07_The_Debate.mp3', type: 'audio/mpeg'},
        { src: '../audio/08_Working_At_First.mp3', type: 'audio/mpeg'},
        { src: '../audio/09_Tried_To_Be.mp3', type: 'audio/mpeg'},
        { src: '../audio/10_The_Basement.mp3', type: 'audio/mpeg'},
        { src: '../audio/11_One_Level_At_A_Time.mp3', type: 'audio/mpeg'},
        { src: '../audio/12_Every_Sound_In_A_Row.mp3', type: 'audio/mpeg'},
        { src: '../audio/13_The_End.mp3', type: 'audio/mpeg'}
    ];

    $scope.metadata = [
        {},
        {
            title: "Funeral March",
            description: "Included for the purposes of mood.  A peaceful place.  Like a Grave at evening time.",
            catalog: "Gr. 0, No. 1"
        },
        {
            title: "Hesitating Sun",
            description: "In this thing he calls his Grave, where he waits for the release from his release, Mark Jumper wastes his thoughts by thinking about time (which, by the way, he had already spent much of in this place; though his thinking is concerned mostly with that time which he had spent in a more distant past than the presently created past (i.e. recent past (i.e. earlier today or yesterday or last week)))." +
                "<br/><br/> Think of a questioning, maybe an exhausted self doubt will do.  He is reflecting, projecting, rejecting, selecting. From this, you will understand his mindset as he divides his memories into categories. " +
                "<br/><br/>Memory One= My Time Working " +
                "<br>Memory Two= My Time Dead " +
                "<br/>Memory Three= My Time Here",
            catalog: "Gr. 0, No. 2"
        },
        {
            title: "Future is Bleaker",
            description: "Picture him in his rooms, where he is surrounded by works unfinished. A noodling doodle on a page reminding him of past failures, but taunting him with efforts expected. " +
                "He is agitated. And his mind is twisting. And he is thinking upon some vision of the future.",
            catalog: "Gr. 0, No. 3"
        },
        {
            title: "Sad to Feel the Same",
            description: "See him now, some months since first arriving, his intricate self analysis having grown more complex with each rumination. " +
                "The roots of his misery lay bare and shriveling in the sun, but still he feels/thinks/is the same.",
            catalog: "Gr. 0, No. 4"
        },
        {
            title: "Sit on a Dream",
            description: "Pacing around the grave one day, he hears a curious sound. " +
                "Something he has not heard in many months. " +
                "Oh, but it is just the wind whistling in his deaf ears. " +
                "Or is it a conversation with an old friend? " +
                "A prattling discourse of prodding and projecting that seems to have as little chance of ending as it has of containing any meaning. " +
                "And yet, when it finally does end, it will be the last time he refuses to leave." +
                "<br/><br/>\"There is life above,\" he is told.  \"It is, perhaps, time to rejoin it.\"",
            catalog: "Gr. 0, No. 5"
        },
        {
            title: "Digging Out",
            description: "A mood and a transition. " +
                "The summer field at night is a place of wonder. " +
                "The grass grown tall. The firing flies flashing. " +
                "The white moonlight mixing with the distant yellow fires of electric bulbs. " +
                "He sees a place of far-off interest, emanating also sounds and smells. " +
                "It is a Circus. <br/><br/>" +
                "Fresh from his waiting turmoil, he stumbles toward this beacon in the night, having no other place to go.",
            catalog: "Cr. 0, No. 1"
        },
        {
            title: "The Debate",
            description: "After being overwhelmed by experiences, laying one lesson on top of another, he has arrived at a brilliant idea; so he seeks an audience with Circus management. " +
                "<br/><br/>He hopes to convince the manager to let him stage a performance " +
                "(right away and with the support of the whole Circus). " +
                "He could shake off the cobwebs with the sound of applause." +
                "<br/><br/>A \"Good evening\" and \"thank you\" should do. " +
                "If he could have but 5 minutes to explain... perhaps longer.  " +
                "Complex ideas require complex explanations.",
            catalog: "Cr. 0, No. 2"
        },
        {
            title: "Working at First",
            description: "The story he tells begins something like this: <br/><br/> " +
                "\"I started, a long time ago, working on a project that seemed to me fun and perhaps a little challenging. " +
                " Or at least, it seemed like it would be easy.  That's why I decided to do it.  From the first, " +
                "I felt that I could see the results in their complete form.  Or, it was more like feeling a sensation of " +
                "easily obtainable completion. <br/> " +
                "I used this clarity of vision to guide me forward.  How hard could an easy something be anyway?\" " +
                "<br/><br/>He attempts to clarify by saying this: <br/><br/> " +
                "\"I worked in an office.  I was given access to what seemed like limitless resources.  My inspiration was " +
                "given to me in the form of instructions and tasks.  I worked diligently on many of these tasks, " +
                "and patiently on some others.  I set out on a path to accomplishment at a time when I was not afraid to " +
                "fail.\" ",
            catalog: "Cr. 0, No. 3"
        },
        {
            title: "Tried to Be",
            description: "As he sits and makes explanations, he remembers something he once read; " +
                "or perhaps he is thinking it into existence at this very moment:<br/><br/>" +

                "\"I can recall the events of my death <br/>" +
                "as though they were the memories of another man <br/>" +
                "the biting braid which snuffed my breath <br/>" +
                "the bottles of fluids and powders in cans\"" +

                "<br/><br/>And this is where the story becomes strange and full of other stories.",
            catalog: "Cr. 0, No. 4"
        },
        {
            title: "The Basement",
            description: "\"When the brain says goodbye, as far as I can tell, God seems to give you a secret.\" <br/><br/>" +
                "\"Do you believe in God?\" He is asked. <br/><br/>" +
                "Taking a moment, as though caught off guard by such a question, he replies, \"No, I don't think so.\"",
            catalog: "Cr. 0, No. 5"
        },
        {
            title: "One Level at a Time",
            description: "A body stacked upon a body <br/>" +
                "repeated into heights. <br/>" +
                "All those brains, <br/>" +
                "stacks of wisdom <br/>" +
                "and naive judgements <br/>" +
                "and prejudices <br/>" +
                "and dead thoughts <br/><br/>" +

                "If I were stacked that way, <br/>" +
                "part of the pile, <br/>" +
                "between two others <br/>" +
                "or on top <br/>" +
                "or between this one and the ground, <br/>" +
                "I would be as meaningless <br/>" +
                "as anything else <br/>" +
                "that has been stacked <br/>" +
                "and forgotten.",
            catalog: "Cr. 0, No. 6"
        },
        {
            title: "Every Sound in a Row",
            description: "ONE:<br/>" +
                "I broke my back <br/>" +
                "and my mind, <br/>" +
                "this time beyond repair. <br/>" +
                "I drew into a thought that <br/>" +
                "bit with poison, <br/>" +
                "and a noisome flesh remained. <br/><br/>" +

                "TWO: <br/>" +
                "Waking in a place unfamiliar to me, <br/>" +
                "I stumbled down a flight of steps <br/>" +
                "and kept stumbling down 9 more <br/>" +
                "until, at length, I reached <br/>" +
                "the bottom, where I was also <br/>" +
                "not supposed to be. <br/><br/>" +

                "THREE: <br/>" +
                "Having time to think <br/>" +
                "is the perfect sort of thing. <br/>" +
                "Taking time to rest <br/>" +
                "is prescription at its best. <br/>" +
                "A mind can’t be lost <br/>" +
                "if you grab it with both hands. <br/><br/>" +

                "Memory Four= My Time Left.",
            catalog: "Cr. 0, No. 7"
        },
        {
            title: "The End",
            description: "FOUR: <br/>" +
                "A mind let go <br/>" +
                "is a mind unknown, <br/>" +
                "is a mind let grown. <br/>" +
                "Collapse the tired, buckling knees, <br/>" +
                "release the dreaming from your sleep. <br/>" +
                "Never stop, I suppose. <br/>" +
                "Even though no one is listening.",
            catalog: "Cr. 0, No. 8"
        }
    ];

    this.isPlaying = function () {
        return player.isPlaying;
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

    $scope.getMetadataTitle = function () {
        var extractedPlayer;

        if (player) {
            extractedPlayer = player;
        } else {
            extractedPlayer = setPlayer;
        }

        var currentTrack = extractedPlayer.currentTrack | 0;
        var titleComponents = [
            $scope.metadata[currentTrack].title,
            '<div class="pull-right">',
            $scope.metadata[currentTrack].catalog,
            '</div>',
            '<br/>',
            $filter('timeFilter')(getCurrentTime()),
            "/",
            $filter('timeFilter')(getDuration())
        ];

        return titleComponents.join("&nbsp;");
    };

    $scope.prevTrack = function () {
        var videoAPI = videoService.getVideoAPI();
        if (videoService.isPlaying()) {
            videoAPI.pause();
        }

        player.prev(true);
    };

    $scope.nextTrack = function () {
        var videoAPI = videoService.getVideoAPI();
        if (videoService.isPlaying()) {
            videoAPI.pause();
        }

        player.next(true);
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
        });

});

bdtem.controller('MiddleCtrl', function ($scope, playerService, videoService) {

    $scope.skipToTrack = function (index) {
        var player = playerService.getPlayer();

        videoService.getVideoAPI().pause();

        player.play(index, true);
        if (!player.playing) {
            player.play();
        }
    };

});