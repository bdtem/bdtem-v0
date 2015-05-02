'use strict';

bdtem.service('playerService', function ($rootScope) {
    var bdtemplayer;
    var currentTrack = 0;

    const ALBUM_WILDCARD = "bdtem-track";
    const EPISODE_WILDCARD = "story-episode";
    /*TODO (ABL): Kludge: Should not be using hardcoded value.*/
    const DEFAULT_TEXT = "#000000";

    const ALBUM = "ALBUM";
    const STORY = "STORY";

    var PLAYING = ALBUM;


    function randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    function switchTo(trackList, optionalIndex) {
        currentTrack = optionalIndex ? optionalIndex : 0;

        if (PLAYING != trackList && bdtemplayer) {
            PLAYING = trackList;
            $rootScope.$broadcast('tracklistChange', {
                "trackList": trackList,
                "index": currentTrack
            });
        }
    }

    return {
        currentlyPlaying: function () {
            return PLAYING;
        },
        getCurrentTrack: function () {
            return currentTrack;
        },
        getPlayer: function () {
            return bdtemplayer;
        },
        setPlayer: function (player) {
            bdtemplayer = player;
        },
        setTrackHighlighting: function (trackToHighlight) {
            //Why doesn't this work when initialized outside of the function?
            //Figure this out later; doesn't seem to slow things down much.
            var $tracks;
            var $tracksToClear;
            var idWildcard;

            var $albumTracks = $(".track-menu-entry");
            var $storyTracks = $(".story-menu-entry");
            switch (PLAYING) {
                case ALBUM:
                    idWildcard = ALBUM_WILDCARD;
                    $tracks = $albumTracks;
                    $tracksToClear = $storyTracks;
                    break;
                case STORY:
                    idWildcard = EPISODE_WILDCARD;
                    $tracks = $storyTracks;
                    $tracksToClear = $albumTracks;
                    break;
                default:
                    return;
            }

            var highlightedTrackId = idWildcard + trackToHighlight;

            $tracks.each(function () {
                var trackName = $(this);
                trackName.css({color: (this.id === highlightedTrackId) ? randomColor() : DEFAULT_TEXT});
            });
            $tracksToClear.each(function () {
                $(this).css({color: DEFAULT_TEXT});
            });
        },
        skipTo: function (trackList, index) {
            if (PLAYING != trackList) {
                switchTo(trackList, index)
            } else {
                currentTrack = index;
                $rootScope.$broadcast('trackChange', index);
            }
        },
        skipToEpisode: function (index) {
            this.skipTo(STORY, index);
        },
        skipToTrack: function (index) {
            this.skipTo(ALBUM, index);
        }
    }
})
;