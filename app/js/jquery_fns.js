/**
 * Created by abl on 10/12/14.
 */

$.fn.stretch_text = function () {
    var element = $(this);

    var container_width = element.parent().width();

    var element_width = element.width();

    var nb_char = element.text().length;

    var spacing = container_width / nb_char;

    if (element_width <= container_width) {
        element.removeClass('justify');

        var char_width = element_width / nb_char,
            ltr_spacing = spacing - char_width + (spacing - char_width) / nb_char;

        element.css({'letter-spacing': ltr_spacing});
    } else {
        element.addClass('justify');
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

//    console.log('width');
//    console.log(volumeBar.width());
//    console.log('height');

    var height = volumeBar.outerHeight();

//    console.log(height);

    var left = offset.left - (height * 10);
    var top = -(volumeToggle.height() / 2);

//    console.log(left);

    volumeBar.css({top: top, left: left});

//    console.log($('#volumeToggle').offset());
//    console.log($('#volumeBar').css('left'));
//    console.log($('#volumeBar').css('top'));

};

$(document).ready(function () {
    stretchTheText();
    positionTheVolumeBar();

});

const ROTATE_CLASS = "fa-flip-horizontal";

$(document).ready(function () {
    var tracksMenuToggle = $('#tracks-menu-toggle');
    tracksMenuToggle.sidr({
        name: 'tracks-menu',
        speed: 200,
        side: 'left',
        source: null,
        displace: true,
        onOpen: function () {tracksMenuToggle.addClass(ROTATE_CLASS);},
        onClose: function () {tracksMenuToggle.removeClass(ROTATE_CLASS);},
        renaming: true,
        body: 'left'
    });


    var podcastMenuToggle = $('#podcast-menu-toggle');
    podcastMenuToggle.sidr({
        name: 'podcast-menu',
        speed: 200,
        side: 'right',
        source: null,
        displace: true,
        onOpen: function () {podcastMenuToggle.addClass(ROTATE_CLASS);},
        onClose: function () {podcastMenuToggle.removeClass(ROTATE_CLASS);},
        renaming: true,
        body: 'right'
    });



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


