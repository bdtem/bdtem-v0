'use strict';

bdtem.service('playerService', function ($rootScope, AlbumTracks, StoryEpisodes) {
    var bdtemplayer;

    var currentTrack = 0;

    const ALBUM = "ALBUM";
    const STORY = "STORY";

    const ID_WILDCARD = "bdtem-track";

    var PLAYING = ALBUM;

    function switchTo(trackList, optionalIndex) {

        currentTrack = optionalIndex ? optionalIndex : 0;

        if (PLAYING != trackList && bdtemplayer) {

            console.log("switchto");

            bdtemplayer.pause();
            PLAYING = trackList;
            bdtemplayer.$clearSourceList();
            bdtemplayer.$addSourceList(tracks[trackList]);
        }
    }

    return {
        currentlyPlaying: function () {
            return PLAYING;
        },
        getCurrentTrack: function () {
            return currentTrack;
        },
        setCurrentTrack: function (index) {
            currentTrack = index;
        },
        playAlbum: function (index) {
            switchTo(ALBUM);
            this.skipToTrack(index);
        },
        playStory: function (index) {
            switchTo(STORY);
            this.skipToTrack(index);
        },
        getPlayer: function () {
            return bdtemplayer;
        },
        setPlayer: function (player) {
            bdtemplayer = player;
        },
        getMetadata: function () {
            return PLAYING === ALBUM ? AlbumTracks : StoryEpisodes;
        },
        setTrackHighlighting: function (trackToHighlight) {
            //Why doesn't this work when initialized outside of the function?
            //Figure this out later; doesn't seem to slow things down much.
            var $tracks = $(".track-menu-entry");

            var highlightedTrackId = ID_WILDCARD + trackToHighlight;

            $tracks.each(function () {
                var trackName = $(this);
                /*TODO (ABL): Kludge: Should not be using hardcoded value.*/
                trackName.css({color: (this.id === highlightedTrackId) ? randomColor() : "#000000"});
            });
        },
        skipToTrack: function (index) {
            $rootScope.$broadcast('trackChange', index);
        }
    }
})
;