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


