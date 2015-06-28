'use strict';

bdtem.service('playerService', function ($rootScope) {
    var bdtemplayer;
    var currentTrack = 0;

    var ALBUM_WILDCARD = "bdtem-track";
    var EPISODE_WILDCARD = "story-episode";
    /*TODO (ABL): Kludge: Should not be using hardcoded value.*/
    var DEFAULT_TEXT = "#000000";

    var ALBUM = "ALBUM";
    var STORY = "STORY";

    var PLAYING = ALBUM;

    function randomByte() {
        return (Math.floor(Math.random() * (0xFF)));
    }

    function randomColor() {
        var colorString = '#';
        for (var i = 0; i < 3; i++) {
            var byteString = randomByte().toString(16);
            if (byteString.length < 2) {
                byteString = '0' + byteString;
            }
            colorString = colorString.concat(byteString);
        }

        return colorString;
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
                var isTrackToHighlight = (this.id === highlightedTrackId);

                trackName.css({
                    color: ( isTrackToHighlight) ? randomColor() : DEFAULT_TEXT,
                    'text-decoration': isTrackToHighlight ? 'underline' : 'none'
                });
            });
            $tracksToClear.each(function () {
                $(this).css({color: DEFAULT_TEXT,
                    'text-decoration': 'none'
                });
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