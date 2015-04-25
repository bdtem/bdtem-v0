/**
 * Created by abl on 10/12/14.
 */

var positionTheVolumeBar = function () {
    var volumeToggle = $('#volumeToggle');
    var volumeBar = $('#volumeBar');

    var offset = volumeToggle.position();

    var volumeToggle_width = volumeToggle.find(".buttonz-small").width() / 2;
    // minus left&right paddings
    var paddings = volumeToggle.find(".buttonz-small").innerWidth() - volumeToggle.find(".buttonz-small").width();
    var left = offset.left + volumeToggle_width - paddings;

    var top = -(volumeToggle.height() / 1.2);

    volumeBar.css({top: top, left: left});

};

const ROTATE_CLASS = "fa-flip-horizontal";


$(document).ready(function () {

    var $navbar = $(".navbar-fixed-top");
    var $navbarcontainer = $(".navbar-container-top");

    $navbarcontainer.hover(function () {
        $navbar.fadeIn(750);
    }, function () {
        $navbar.fadeOut(750);
    });

    $navbar.fadeOut(1700);
//
//    setTimeout(function initialNavBarHide() {
//    }, 300);

    var tracksMenuToggle = $('#tracks-menu-toggle');
    var leftWords = $('#left-menu-words');

    var storyMenuToggle = $('#story-menu-toggle');
    var rightWords = $('.right-menu-words');

    function animateIn(selector) {
        selector.animate(
            {
                'top': '88vh',
                'letter-spacing': '0.01vw',
                'padding-right': 0,
                'width': '3.25vw',
                'line-height': '1.5vh'
            },
            300, 0, 0);
    }

    function animateOut(selector) {
        selector.animate(
            {
                'top': '40vh',
                'letter-spacing': '1.5vw',
                'line-height': "2vh"
            },
            500, 0, 0);
    }


    positionTheVolumeBar();

    tracksMenuToggle.sidr({
        name: 'tracks-menu',
        speed: 200,
        side: 'left',
        source: null,
        displace: true,
        onOpen: function () {
            animateIn(tracksMenuToggle);
            tracksMenuToggle.addClass(ROTATE_CLASS);
            leftWords.removeClass('left-menu-words');
            leftWords.css({display: 'none'});
        },
        onClose: function () {
            tracksMenuToggle.removeClass(ROTATE_CLASS);
            animateOut(tracksMenuToggle);
            leftWords.addClass('left-menu-words');
            leftWords.css({display: 'inline' });
        },
        renaming: true,
        body: 'left'
    });

    storyMenuToggle.sidr({
        name: 'story-menu',
        speed: 200,
        side: 'right',
        source: null,
        displace: true,
        onOpen: function () {
            storyMenuToggle.addClass(ROTATE_CLASS);
            animateIn(storyMenuToggle);
            rightWords.removeClass('right-menu-words');
            rightWords.css({display: 'none'});
        },
        onClose: function () {
            storyMenuToggle.removeClass(ROTATE_CLASS);

            animateOut(storyMenuToggle);

            rightWords.addClass('right-menu-words');
            rightWords.css({display: 'inline'});
        },
        renaming: true,
        body: 'right'
    });


    animateOut(storyMenuToggle);
    animateOut(tracksMenuToggle);
})
;