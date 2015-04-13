bdtem.service('playerService', function ($rootScope, AlbumTracks, StoryEpisodes) {
    var bdtemplayer;


    const ALBUM = "ALBUM";
    const STORY = "STORY";

    var PLAYING = ALBUM;

    var tracks = {
        "ALBUM": AlbumTracks,
        "STORY": StoryEpisodes
    };

    const ID_WILDCARD = "bdtem-track";
    var $tracks = $(".track-menu-entry");

    function switchTo(trackList) {
        if (PLAYING != trackList && bdtemplayer) {
            bdtemplayer.pause();
            PLAYING = trackList;
            bdtemplayer.$clearSourceList();
            bdtemplayer.$addSourceList(tracks[trackList]);
        }
    }

    return {
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
            var highlightedTrackId = ID_WILDCARD + trackToHighlight;

            $tracks.each(function () {
                var trackName = $(this);
                /*TODO (ABL): Kludge: Should not be using hardcoded value.*/
                var isTrackToHighlight = (this.id === highlightedTrackId);
                trackName.css({
                    color: isTrackToHighlight ? randomColor() : "#000000",
                    'text-decoration': isTrackToHighlight ? "underline" : "none"
                });
            });
        },
        skipToTrack: function (index) {

            //Because angular media player is dumb and 1-based. Remove this correction after changing to videogular.
            bdtemplayer.play(index, true);

            bdtemplayer.load(true);
            $rootScope.$broadcast('trackChange', index);

            this.setTrackHighlighting(index);
        }
    }
});