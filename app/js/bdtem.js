var bdtem = angular.module('bdtem', ['bdtemFilters', 'mediaPlayer', 'cfp.hotkeys', 'ui.bootstrap']);

bdtem.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);

bdtem.controller('ButtonsCtrl', function ($scope, $modal) {

    $scope.buttons = [
        {
            purpose: 'Share',
            glyph: '\ue801',
            tooltip: 'TELL YOUR FRIENDS ABOUT RICK!',
            action: function () {
                var duration = 1000;
                var holdOldValue = this.tooltip;
                this.tooltip = "THIS ISN'T IMPLEMENTED YET LOL!11! xD";
                AnimateRotate('#button-' + this.purpose, 360, duration);

                setTimeout(function () {
                    $scope.buttons[0].tooltip = holdOldValue;
                }, duration);
            }
        },
        {
            purpose: 'Donate',
            glyph: '\ue802',
            tooltip: 'GIVE RICK SOME DOUGH!',
            action: function () {
                $modal.open({
                    templateUrl: 'templates/donate.html',
                    controller: 'DonateCtrl',
                    size: 'lg'
                })
            }
        },
        {
            purpose: 'Newsletter',
            glyph: '\ue808',
            tooltip: 'WHAT\'S UP WITH RICK?',
            action: function () {
                window.open('https://tinyletter.com/Department_of_Archives');
            }
        },
        {
            purpose: 'Contact',
            glyph: '\ue809',
            tooltip: 'GIVE RICK A CALL!',
            action: function () {
            }
        }
    ];

});

bdtem.controller('DonateCtrl', function ($scope) {

});


bdtem.controller('PlaylistCtrl', function ($scope, $filter, hotkeys, $sce) {

    $scope.songs = [
        { src: '../audio/01_Funeral_March.mp3', type: 'audio/mpeg'},
        { src: '../audio/02_Hesitating_Sun.mp3', type: 'audio/mpeg'},
        { src: '../audio/03_Future_Is_Bleaker.mp3', type: 'audio/mpeg'},
        { src: '../audio/04_Sad_to_Feel_the_Same.mp3', type: 'audio/mpeg'},
        { src: '../audio/05_Sit_on_a_Dream.mp3', type: 'audio/mpeg'},
        { src: '../audio/06_Digging_Out.mp3', type: 'audio/mpeg'},
        { src: '../audio/07_The_Debate.mp3', type: 'audio/mpeg'},
        { src: '../audio/08_Working_at_First.mp3', type: 'audio/mpeg'},
        { src: '../audio/09_Tried_to_Be.mp3', type: 'audio/mpeg'},
        { src: '../audio/10_The_Basement.mp3', type: 'audio/mpeg'},
        { src: '../audio/11_One_Level_at_a_Time.mp3', type: 'audio/mpeg'},
        { src: '../audio/12_Every_Sound_in_a_Row.mp3', type: 'audio/mpeg'},
        { src: '../audio/13_The_End.mp3', type: 'audio/mpeg'}
    ];

    $scope.titles = [
        "",
        "Funeral March",
        "Hesitating Sun",
        "Future Is Bleaker",
        "Sad to Feel the Same",
        "Sit on a Dream",
        "Digging Out",
        "The Debate",
        "Working at First",
        "Tried to Be",
        "The Basement",
        "One Level at a Time",
        "Every Sound in a Row",
        "The End"
    ];

    $scope.metadata = [
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
            description: "Picture him in his rooms, where he is surrounded by works unfinished. A noodling doodle on a page reminding him of past failures, but taunting him with efforts expected." +
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
                "It is a Circus. " +
                "Fresh from his waiting turmoil, he stumbles toward this beacon in the night, having no other place to go.",
            catalog: "Cr. 0, No. 1"
        },
        {
            title: "The Debate",
            description: "After being overwhelmed by experiences, laying one lesson on top of another, he has arrived at a brilliant idea, so he seeks an audience with Circus management. " +
                "He hopes to convince the manager to let him stage a performance. " +
                "Right away and with the support of the whole Circus. " +
                "He could shake off the cobwebs with the sound of applause." +
                "<br/><br/>A \"Good evening\" and \"thank you\" should do. " +
                "If he could have but 5 minutes to explain... perhaps longer.  " +
                "Complex ideas require complex explanations.",
            catalog: "Cr. 0, No. 2"
        },
        {
            title: "Working at First",
            description: "After being overwhelmed by experiences, laying one lesson on top of another, he has arrived at a brilliant idea, so he seeks an audience with Circus management. " +
                "He hopes to convince the manager to let him stage a performance. " +
                "Right away and with the support of the whole Circus. " +
                "He could shake off the cobwebs with the sound of applause." +
                "<br/><br/>A \"Good evening\" and \"thank you\" should do. " +
                "If he could have but 5 minutes to explain... perhaps longer.  " +
                "Complex ideas require complex explanations.",
            catalog: "Cr. 0, No. 3"
        }
    ];

    $scope.catalogNumbers = $scope.titles.map(function (element, index) {
        return  'Gr. 2' + ' No. ' + index;
    });

    this.isPlaying = function () {
        return $scope.bdtemplayer.isPlaying;
    };

    var getCurrentTime = function () {
        return $scope.bdtemplayer.currentTime | 0;
    };
    $scope.__defineGetter__('currentTime', getCurrentTime);

    var getDuration = function () {
        return $scope.bdtemplayer.duration | 0;
    };
    $scope.__defineGetter__('currentDuration', getDuration);

    $scope.seekFromProgressBar = function (event) {
        var srcElement = event.srcElement;
        var sourceElement = srcElement ? srcElement : event.target;

        var pxWidth = sourceElement.offsetWidth;
        var xOffset = sourceElement.offsetParent.offsetLeft;
        var clickOffset = event.layerX | event.clientX;
        var pixelsRight = Math.abs(xOffset - clickOffset);

        var percentage = pixelsRight / pxWidth;
        var whereToSeekInDuration = Math.floor(percentage * getDuration());

        $scope.bdtemplayer.seek(whereToSeekInDuration);
    };

    $scope.seekTo = function (whereToSeek) {
        $scope.bdtemplayer.seek(whereToSeek | 0);
    };

    this.seekTo = function (whereToSeek) {
        $scope.bdtemplayer.seek(whereToSeek | 0);
    };

    $scope.getMetadataTitle = function () {
        var titleComponents = [
            $scope.titles[$scope.bdtemplayer.currentTrack],
            '<div class="pull-right">',
            $scope.catalogNumbers[$scope.bdtemplayer.currentTrack],
            '</div>',
            '<br/>',
            $filter('timeFilter')(getCurrentTime()),
            "/",
            $filter('timeFilter')(getDuration())
        ];

        return titleComponents.join(" ");
    };

    $scope.prev = function () {
        $scope.bdtemplayer.prev();
    };

    $scope.next = function () {
        $scope.bdtemplayer.next();
    };

    $scope.bdtemPlayPause = function () {
        $scope.bdtemplayer.playPause();
    };

    $scope.skipToTrack = function (index) {
        $scope.bdtemplayer.play(index, true);
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
                $scope.prev();
            }
        }).add({
            combo: 'right',
            description: 'Next Track',
            callback: function () {
                $scope.next();
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

    $scope.isSceEnabled = function () {
        return $sce.isEnabled();
    }
});

// update popover template for binding unsafe html
angular.module("template/popover/popover.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/popover/popover.html",
            "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
            "  <div class=\"arrow\"></div>\n" +
            "\n" +
            "  <div class=\"popover-inner\">\n" +
            "      <h3 class=\"popover-title\" ng-bind-html=\"title | unsafe\" ng-show=\"title\"></h3>\n" +
            "      <div class=\"popover-content\"ng-bind-html=\"content | unsafe\"></div>\n" +
            "  </div>\n" +
            "</div>\n" +
            "");
}]);