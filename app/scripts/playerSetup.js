/**
 * Created by abl on 22/06/14.
 */

$(document).ready(function(){
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                title: "Funeral March",
                mp3: "../audio/01_Funeral_March.mp3"
            });
        },
        swfPath: "/js",
        supplied: "mp3"
    });
});
