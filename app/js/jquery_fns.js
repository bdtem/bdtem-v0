/**
 * Created by abl on 10/12/14.
 */

$.fn.stretch_text = function () {
    var element = $(this),
        container_width = element.parent().width(),
        element_width = element.width(),
        nb_char = element.text().length,
        spacing = container_width / nb_char;

    if (element_width <= container_width) {
        var char_width = element_width / nb_char,
            ltr_spacing = spacing - char_width + (spacing - char_width) / nb_char;

        element.css({'letter-spacing': ltr_spacing});
    } else {
        element.contents().unwrap();
        element.addClass('justify');
    }
};

$(document).ready(function () {

    $('.stretched').each(function () {
        $(this).stretch_text();
    });

    $(window).resize(function() {console.log('fuck yo couch')});

});


function AnimateRotate(selector, angle, animationDuration) {
    // caching the object for performance reasons
    var $elem = $(selector);

    // we use a pseudo object for the animation
    // (starts from `0` to `angle`), you can name it as you want
    $({deg: 0}).animate({deg: angle}, {
        duration: animationDuration,
        step: function(now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            $elem.css({
                transform: 'rotate(' + now + 'deg)'
            });
        }
    });
}


