/**
 * Created by abl on 10/12/14.
 */

$.fn.stretch_text = function () {
    var element = $(this);
<<<<<<< HEAD
        var container_width = element.parent().width();
=======
    var container_width = element.parent().width();
>>>>>>> 54938b80031f8a4b6e465b6251c5cf99e82e6e32

    var element_width = element.width();

    var nb_char = element.text().length;

    var spacing = container_width / nb_char;

    if (element_width <= container_width) {

        var char_width = element_width / nb_char,
            ltr_spacing = spacing - char_width + (spacing - char_width) / nb_char;

        element.css({'letter-spacing': ltr_spacing});
    }
};

function stretchTheText() {
    var $stretched = $('.stretched');

    $stretched.each(function () {
        $(this).stretch_text();
    });
}

var positionTheVolumeBar = function () {
    var volumeToggle = $('#volumeToggle');
    var volumeBar = $('#volumeBar');

    var offset = volumeToggle.offset();

    var height = volumeBar.outerHeight();

    var left = offset.left - (height * 10);
    var top = -(volumeToggle.height() / 2);

    volumeBar.css({top: top, left: left});

};

const ROTATE_CLASS = "fa-flip-horizontal";

$(document).ready(function () {

    positionTheVolumeBar();

    var tracksMenuToggle = $('#tracks-menu-toggle');
<<<<<<< HEAD
=======
    var leftWords = $('#left-menu-words');



    var animateLeftIn = function () {
        tracksMenuToggle.animate(
            {
                'letter-spacing': '0.01vw',
                'padding-right': 0,
                'margin': 0,
                'width': '3.25vw'
            },
            500, 0, 0);
    };

    var animateLeftOut = function () {
        tracksMenuToggle.animate(
            {
                'letter-spacing': '1.5vw',
                'margin': '0.1w'},
            500, 0, 0);
    };

>>>>>>> 54938b80031f8a4b6e465b6251c5cf99e82e6e32
    tracksMenuToggle.sidr({
        name: 'tracks-menu',
        speed: 200,
        side: 'left',
        source: null,
        displace: true,
<<<<<<< HEAD
        onOpen: function () {stretchTheText(); tracksMenuToggle.addClass(ROTATE_CLASS);},
        onClose: function () {tracksMenuToggle.removeClass(ROTATE_CLASS);},
=======
        onOpen: function () {
            stretchTheText();
            tracksMenuToggle.addClass(ROTATE_CLASS);
            animateLeftIn();
            leftWords.removeClass('left-menu-words');
            leftWords.css({display: 'none'});
        },
        onClose: function () {
            tracksMenuToggle.removeClass(ROTATE_CLASS);
            animateLeftOut();
            leftWords.addClass('left-menu-words');
            leftWords.css({display: 'inline'});
        },
>>>>>>> 54938b80031f8a4b6e465b6251c5cf99e82e6e32
        renaming: true,
        body: 'left'
    });


    var podcastMenuToggle = $('#podcast-menu-toggle');
<<<<<<< HEAD
=======
    var rightWords = $('.right-menu-words');


    var animateRightIn = function () {
        podcastMenuToggle.animate(
            {
                'letter-spacing': '0.01vw',
                'padding-right': 0,
                'margin': 0,
                'width': '3.25vw'
            },
            500, 0, 0);
    };

    var animateRightOut = function () {
        podcastMenuToggle.animate(
            {
                'letter-spacing': '1.5vw',
                'margin': '0.1w'},
            500, 0, 0);
    };


>>>>>>> 54938b80031f8a4b6e465b6251c5cf99e82e6e32
    podcastMenuToggle.sidr({
        name: 'podcast-menu',
        speed: 200,
        side: 'right',
        source: null,
        displace: true,
<<<<<<< HEAD
        onOpen: function () {podcastMenuToggle.addClass(ROTATE_CLASS);},
        onClose: function () {podcastMenuToggle.removeClass(ROTATE_CLASS);},
=======
        onOpen: function () {
            podcastMenuToggle.addClass(ROTATE_CLASS);
            animateRightIn();
            rightWords.removeClass('right-menu-words');
            rightWords.css({display: 'none'});
        },
        onClose: function () {
            podcastMenuToggle.removeClass(ROTATE_CLASS);
//            podcastMenuToggle.addClass('menu-spaced');

            animateRightOut();

//            rightWords.addClass('right-menu-words');
            rightWords.css({display: 'inline'});
        },
>>>>>>> 54938b80031f8a4b6e465b6251c5cf99e82e6e32
        renaming: true,
        body: 'right'
    });


<<<<<<< HEAD

=======
    animateLeftOut();
    animateRightOut();
>>>>>>> 54938b80031f8a4b6e465b6251c5cf99e82e6e32
});

$(window).resize(function () {
    positionTheVolumeBar();
});

function AnimateRotate(selector, angle, animationDuration) {
    // caching the object for performance reasons
    var $elem = $(selector);

    // we use a pseudo object for the animation
    // (starts from `0` to `angle`), you can name it as you want
    $({deg: 0}).animate({deg: angle}, {
        duration: animationDuration,
        step: function (now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            $elem.css({
                transform: 'rotate(' + now + 'deg)'
            });
        }
    });
}


